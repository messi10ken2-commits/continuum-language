"""Offline regression checks for the additional Continuum prelaunch showcase."""
import io
import unittest
from datetime import date, datetime, time, timezone
from unittest.mock import patch
from social_automation import showcase

class ShowcaseTests(unittest.TestCase):
    def test_only_intended_days_have_slots(self):
        self.assertEqual(showcase.slots_for(date(2026, 11, 11))[0][0], "instagram")
        self.assertEqual(len(showcase.slots_for(date(2026, 11, 12))), 2)
        self.assertFalse(showcase.slots_for(date(2026, 11, 13)))
        self.assertEqual(showcase.slots_for(date(2026, 11, 14))[0][1], "gallery")
        self.assertEqual(len(showcase.slots_for(date(2026, 11, 15))), 2)
        self.assertFalse(showcase.slots_for(date(2027, 1, 1)))

    def test_gallery_reuses_previous_saturday(self):
        self.assertEqual(showcase.visual_day(date(2026, 11, 15)), date(2026, 11, 14))
        self.assertEqual(showcase.visual_day(date(2026, 11, 14)), date(2026, 11, 14))

    def test_captions_are_explicit_about_prelaunch(self):
        for kind in ("video", "gallery"):
            for p in ("x", "threads", "instagram"):
                s = showcase.caption(p, kind, date(2026, 11, 14))
                self.assertGreater(len(s), 60)
                self.assertTrue(any(m in s.lower() for m in
                    ("not publicly launched", "before public", "final development",
                     "final testing", "in development", "before rollout")))
                if p == "x":
                    self.assertLessEqual(len(s), 255)
                if kind == "gallery":
                    self.assertTrue(any(word in s.lower() for word in ("artwork", "visual assets", "in-app visual")))

    def test_existing_promo_video_asset(self):
        self.assertTrue(showcase.VIDEO_URL.endswith("public/membership/premium-promotion-v2.mp4"))

    def test_video_mutation_creates_reel(self):
        calls = []
        def mocked(query, token):
            calls.append(query)
            return {"createPost": {"post": {"id": "new_id", "assets": [{"id": "m", "mimeType": "video/mp4"}]}}}
        ch = {"id": "ch", "orgId": "org"}
        with patch.object(showcase, "buffer_query", mocked):
            ident = showcase.create_showcase_post("tok", ch, "instagram", "video",
                       date(2026, 11, 11), datetime.now(timezone.utc), [showcase.VIDEO_URL])
        self.assertEqual(ident, "new_id")
        self.assertIn("type: reel", calls[0])
        self.assertIn("video: {url:", calls[0])
        self.assertIn("customScheduled", calls[0])

    def test_gallery_requires_four_assets(self):
        ch = {"id": "ch", "orgId": "org"}
        with self.assertRaises(ValueError):
            showcase.create_showcase_post("tok", ch, "instagram", "gallery",
                      date(2026, 11, 14), datetime.now(timezone.utc), ["bad.jpg"])

    def test_gallery_cards_are_portrait_jpegs(self):
        from PIL import Image
        for i in range(len(showcase.VISUALS)):
            picture = Image.open(io.BytesIO(showcase.build_gallery_card(i)))
            self.assertEqual(picture.size, (1080, 1350))
            self.assertEqual(picture.format, "JPEG")

    def test_idempotent_slot_check(self):
        due = datetime(2026, 11, 11, 12, 0, tzinfo=timezone.utc)
        def mocked(query, token):
            return {"posts": {"edges": [{"node": {"id": "existing", "channelId": "ch",
                         "dueAt": due.isoformat().replace("+00:00", "Z")}}]}}
        with patch.object(showcase, "buffer_query", mocked):
            self.assertTrue(showcase.existing_post("token", {"id": "ch", "orgId": "org"}, due))
            self.assertFalse(showcase.existing_post("token", {"id": "other", "orgId": "org"}, due))

    def test_timezone(self):
        when = showcase.due_at(date(2026, 11, 11), time(19, 45))
        self.assertEqual((when.hour, when.minute), (11, 45))

    def test_dry_run_creates_no_remote_posts(self):
        with patch("sys.argv", ["showcase.py", "--date", "2026-11-11", "--dry-run"]), \
             patch.object(showcase, "buffer_query", side_effect=AssertionError("Buffer call")):
            showcase.main()

if __name__ == "__main__":
    unittest.main()
