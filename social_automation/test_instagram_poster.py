import os
import unittest
from datetime import date, timedelta
from unittest.mock import patch
from xml.etree import ElementTree
from social_automation.instagram_poster import (
    TOPICS, publication_dates, plan_for, due_at, instagram_channel,
    exists_in_buffer, buffer_schedule, fallback_caption, render_svg, wrap_words,
)

class InstagramTests(unittest.TestCase):
    def test_weekly_rotation_and_category(self):
        self.assertEqual([d.weekday() for d in publication_dates(date(2026,10,30))][:4], [4,0,2,4])
        self.assertEqual(plan_for(date(2026,10,30))["category"], "learning_mindset")
        self.assertEqual(plan_for(date(2026,11,2))["category"], "language_tip")
        self.assertEqual(plan_for(date(2026,11,4))["category"], "continuum_update")
        with self.assertRaises(ValueError):
            plan_for(date(2026,10,31))

    def test_timezone(self):
        self.assertEqual(due_at(date(2026,11,2)).isoformat(), "2026-11-02T11:00:00+00:00")

    def test_image_svg_xml_and_caption(self):
        for wd in (0,2,4):
            day = date(2026,11,2)+timedelta(days=wd)
            plan = plan_for(day)
            root = ElementTree.fromstring(render_svg(plan))
            self.assertTrue(root.tag.endswith("svg"))
            self.assertIn("Continuum", render_svg(plan))
            self.assertIn("#", fallback_caption(plan))
            self.assertLessEqual(max(map(len,wrap_words(plan["description"],40))),40)
            if wd == 2:
                self.assertIn("development",fallback_caption(plan))

    @patch("social_automation.instagram_poster.buffer_query")
    def test_channel_discovery(self, mock_buffer):
        mock_buffer.side_effect = [
            {"account":{"organizations":[{"id":"org1","name":"Brand"}]}},
            {"channels":[{"id":"insta","name":"continuum","service":"instagram",
                          "isDisconnected":False,"isLocked":False,"isQueuePaused":False},
                         {"id":"x","name":"x","service":"twitter"}]},
        ]
        with patch.dict(os.environ,{"INSTAGRAM_CHANNEL_ID":""}):
            ch=instagram_channel("token")
        self.assertEqual((ch["id"],ch["orgId"]),("insta","org1"))

    @patch("social_automation.instagram_poster.buffer_query")
    def test_duplicate_post_check(self,mock_buffer):
        mock_buffer.return_value={"posts":{"edges":[{"node":{"id":"p1","channelId":"insta",
                               "dueAt":"2026-11-02T11:00:00.000Z"}}]}}
        ch={"id":"insta","orgId":"org1"}
        self.assertTrue(exists_in_buffer("token",ch,due_at(date(2026,11,2))))
        self.assertIn("status: [scheduled, sent]",mock_buffer.call_args.args[0])

    @patch("social_automation.instagram_poster.buffer_query")
    def test_image_post_mutation(self,mock_buffer):
        mock_buffer.return_value={"createPost":{"post":{"id":"p1","assets":[{"id":"a1","mimeType":"image/png"}]}}}
        url="https://raw.githubusercontent.com/org/repo/instagram-media/assets/instagram/2026-11-02.png"
        pid=buffer_schedule("token",{"id":"insta"},"Hello #Learning",url,due_at(date(2026,11,2)))
        self.assertEqual(pid,"p1")
        query=mock_buffer.call_args.args[0]
        for snippet in ("schedulingType: automatic","mode: customScheduled","assets: [{image: {url:",url):
            self.assertIn(snippet,query)
        self.assertIn('2026-11-02T11:00:00.000Z',query)

    @patch("social_automation.instagram_poster.buffer_query")
    def test_missing_image_is_failure(self,mock_buffer):
        mock_buffer.return_value={"createPost":{"post":{"id":"p1","assets":[]}}}
        with self.assertRaises(RuntimeError):
            buffer_schedule("token",{"id":"insta"},"test","https://example.com/i.png",due_at(date(2026,11,2)))

if __name__ == "__main__":
    unittest.main()
