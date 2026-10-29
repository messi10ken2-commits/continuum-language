import io, json, os, unittest
from datetime import date
from unittest.mock import patch
from PIL import Image

from social_automation.vlog_carousel import (
    VLOG_FIRST_DATE, is_vlog_day, media_paths, make_slides,
    vlog_caption, schedule_carousel, produce_and_schedule, media_urls,
)

class TestVlogCarousel(unittest.TestCase):
    def test_monday_and_fixed_start(self):
        self.assertTrue(is_vlog_day(date(2026,11,9)))
        self.assertTrue(is_vlog_day(date(2026,11,16)))
        self.assertFalse(is_vlog_day(date(2026,11,2)))
        self.assertFalse(is_vlog_day(date(2026,11,11)))
        self.assertEqual(len(media_paths(date(2026,11,9))),4)

    def test_create_four_real_jpegs_with_fictional_label(self):
        im=Image.new("RGB",(1024,1536),(40,90,110))
        b=io.BytesIO()
        im.save(b,format="JPEG")
        result=make_slides(b.getvalue())
        self.assertEqual(len(result),4)
        for item in result:
            self.assertTrue(item.startswith(b"\xff\xd8\xff"))
            pic=Image.open(io.BytesIO(item))
            self.assertEqual(pic.size,(1080,1350))

    def test_caption_has_times_and_illustration_disclosure(self):
        s=vlog_caption(date(2026,11,9))
        for part in ("10:00 AM","2:00 PM","8:30 PM","#LanguageLearning","Illustrative"):
            self.assertIn(part,s)

    @patch("social_automation.vlog_carousel.buffer_query")
    def test_buffer_carousel_mutation_has_four_assets(self,query):
        query.return_value={"createPost":{"post":{"id":"p1","dueAt":"2026-11-09T11:00:00.000Z",
             "assets":[{"id":str(i),"mimeType":"image/jpeg"} for i in range(4)]}}}
        urls=["https://raw.githubusercontent.com/a/b/instagram-media/x"+str(i)+".jpg" for i in range(4)]
        pid=schedule_carousel("fake",{"id":"ig"},date(2026,11,9),urls,"Hello")
        self.assertEqual(pid,"p1")
        mutation=query.call_args.args[0]
        self.assertEqual(mutation.count("image: {url:"),4)
        self.assertIn("type: post",mutation)
        self.assertIn("schedulingType: automatic",mutation)

    @patch("social_automation.vlog_carousel.buffer_query")
    def test_buffer_rejects_partial_carousel(self,query):
        query.return_value={"createPost":{"post":{"id":"p1","assets":[{"id":"a1"}]}}}
        with self.assertRaises(RuntimeError):
            schedule_carousel("fake",{"id":"ig"},date(2026,11,9),
                              ["https://example.com/"+str(i)+".jpg" for i in range(4)],"caption")

    @patch("social_automation.vlog_carousel.exists_in_buffer",return_value=True)
    def test_existing_post_not_overwritten(self,_):
        pid=produce_and_schedule(date(2026,11,9),"fake",{"id":"ig"})
        self.assertIsNone(pid)

if __name__=="__main__":
    unittest.main()
