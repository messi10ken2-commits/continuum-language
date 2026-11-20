"""Offline checks for optional trend, performance and existing Instagram media reuse."""
import io
import os
import unittest
from datetime import date
from unittest.mock import patch

from social_automation.strategy import (
    engagement_score, google_trend_brief, instagram_vlog_date,
    is_language_trend, performance_brief, vlog_assets_for, vlog_caption_for,
)
from social_automation.poster import schedule, target_datetimes


class MockResponse:
    def __init__(self, payload=b"", status=200):
        self.payload = io.BytesIO(payload)
        self.status = status

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.payload.close()

    def read(self, size=-1):
        return self.payload.read(size)


class TestSocialStrategy(unittest.TestCase):
    def test_filters_unrelated_news(self):
        self.assertFalse(is_language_trend("Japan vs Brazil football"))
        self.assertFalse(is_language_trend("English Premier League"))
        self.assertTrue(is_language_trend("language learning"))
        self.assertTrue(is_language_trend("JLPT 2026"))

    def test_verified_trends_only(self):
        feed = (b"<rss><channel><item><title>JLPT 2026</title></item>"
                b"<item><title>Japan vs Brazil</title></item></channel></rss>")
        def opener(req, timeout):
            return MockResponse(feed)
        result = google_trend_brief(opener)
        self.assertIn("JLPT 2026", result)
        self.assertNotIn("Japan vs Brazil", result)
        self.assertIn("not proof", result)
        self.assertEqual(google_trend_brief(lambda req, timeout: MockResponse(
            b"<rss><channel><item><title>Football</title></item></channel></rss>")), "")

    def test_failed_trend_feed_is_safe(self):
        def unavailable(req, timeout):
            raise OSError("Offline")
        self.assertEqual(google_trend_brief(unavailable), "")

    def test_only_use_normalized_rates(self):
        self.assertIsNone(engagement_score([{"type":"reactions","value":15}]))
        self.assertAlmostEqual(engagement_score([
            {"type":"reactions","value":8}, {"type":"impressions","value":200},
            {"type":"comments","value":2}]), 5.0)
        self.assertAlmostEqual(engagement_score([{"type":"engagementRate","value":12.5}]), 12.5)

    @patch("social_automation.strategy.buffer_query")
    def test_performance_requires_sufficient_scored_posts(self, mock_query):
        channels = {"x":{"id":"x1","orgId":"org1"},
                    "threads":{"id":"t1","orgId":"org1"}}
        mock_query.side_effect = [
            {"posts":{"edges":[{"node":{"text":"Tip", "metrics":[], "metricsUpdatedAt":None}}]}},
            {"posts":{"edges":[]}},
        ]
        self.assertEqual(performance_brief("key",channels,date(2026,11,10)), "")
        self.assertIn("metricsUpdatedAt", mock_query.call_args_list[0].args[0])

    @patch("social_automation.strategy.buffer_query")
    def test_performance_summarizes_only_own_measured_posts(self, mock_query):
        channels = {"x":{"id":"x1","orgId":"org1"},
                    "threads":{"id":"t1","orgId":"org1"}}
        nodes = [{"node":{"text": f"Language tip {i}: short example.",
                          "metrics":[{"type":"engagementRate","value":10.0+i}],
                          "metricsUpdatedAt":"2026-11-08T00:00:00Z"}}
                 for i in range(4)]
        mock_query.side_effect = [{"posts":{"edges":nodes}}, {"posts":{"edges":[]}}]
        brief=performance_brief("key", channels, date(2026,11,10))
        self.assertIn("Language tip 3", brief)
        self.assertIn("X (4 measured posts)", brief)
        self.assertNotIn("THREADS (", brief)

    @patch("social_automation.strategy.buffer_query")
    def test_insights_permission_failure_does_not_block_posts(self, mock_query):
        mock_query.side_effect=RuntimeError("No insightsRead scope")
        channels={"x":{"id":"x1","orgId":"org1"},
                  "threads":{"id":"t1","orgId":"org1"}}
        self.assertEqual(performance_brief("key",channels,date(2026,11,10)), "")

    def test_crosspost_follows_instagram_monday(self):
        self.assertIsNone(instagram_vlog_date(date(2026,11,9)))
        self.assertEqual(instagram_vlog_date(date(2026,11,10)),date(2026,11,9))
        self.assertIsNone(instagram_vlog_date(date(2026,11,11)))
        self.assertIsNone(instagram_vlog_date(date(2026,11,3)))
        for channel in ("x", "threads"):
            caption=vlog_caption_for(channel)
            self.assertIn("10 AM",caption)
            self.assertIn("2 PM",caption)
            self.assertIn("8:30 PM",caption)
            self.assertIn("illustrative", caption.lower())
            self.assertLessEqual(len(caption),235 if channel=="x" else 365)

    def test_crosspost_uses_same_four_public_instagram_urls(self):
        with patch.dict(os.environ, {"GITHUB_REPOSITORY":"owner/continuum-language"}):
            def opener(req, timeout):
                self.assertIn("/instagram-media/assets/instagram/2026-11-09-vlog-",req.full_url)
                return MockResponse(b"\xff\xd8\xffabc")
            urls=vlog_assets_for(date(2026,11,10),opener)
        self.assertEqual(len(urls),4)
        self.assertTrue(urls[0].endswith("2026-11-09-vlog-1.jpg"))
        self.assertTrue(urls[-1].endswith("2026-11-09-vlog-4.jpg"))

    def test_missing_carousel_does_not_fabricate_media(self):
        with patch.dict(os.environ, {"GITHUB_REPOSITORY":"owner/continuum-language"}):
            self.assertIsNone(vlog_assets_for(date(2026,11,10),
                                             lambda req, timeout: MockResponse(b"<html>")))
        self.assertIsNone(vlog_assets_for(date(2026,11,11)))

    @patch("social_automation.poster.buffer_query")
    def test_media_post_confirms_all_four_images(self, mock_query):
        mock_query.return_value={"createPost":{"post":{
            "id":"id_1","assets":[{"id":str(i),"mimeType":"image/jpeg"} for i in range(4)]}}}
        urls=[f"https://example.org/{i}.jpg" for i in range(4)]
        pid=schedule("key","x1","Study with me",target_datetimes(date(2026,11,10))["afternoon"],urls)
        self.assertEqual(pid,"id_1")
        graph=mock_query.call_args.args[0]
        self.assertEqual(graph.count("image: {url:"),4)
        self.assertIn("assets { id mimeType }",graph)


if __name__=="__main__":
    unittest.main()
