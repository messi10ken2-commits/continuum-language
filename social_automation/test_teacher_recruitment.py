"""Offline tests: safe scheduling and native-language teacher recruitment."""
import json
import os
import unittest
from datetime import date, datetime, timezone
from unittest.mock import patch

from social_automation import teacher_recruitment as tr


class TeacherRecruitmentTests(unittest.TestCase):
    def test_ten_languages_and_target_native_scripts(self):
        self.assertEqual(len(tr.LANGUAGES), 10)
        self.assertEqual(len({l[0] for l in tr.LANGUAGES}), 10)
        for lang in tr.LANGUAGES:
            for p, body in tr.prepared_copy(lang).items():
                self.assertTrue(tr.native_text_ok(body, lang, p), (lang[0], p, tr.weighted_x_length(body)))
                self.assertTrue(tr.native_text_ok(tr.tag_post(body, lang, p), lang, p))

    def test_fixed_rotation_and_end(self):
        first = date(2026, 11, 10)
        self.assertTrue(tr.recruitment_day(first))
        self.assertEqual(tr.planned_language(first)[0], "ja")
        valid = [first]
        while len(valid) < 20:
            n = valid[-1] + __import__("datetime").timedelta(days=1)
            while not tr.recruitment_day(n):
                n += __import__("datetime").timedelta(days=1)
            valid.append(n)
        self.assertEqual([tr.planned_language(d)[0] for d in valid[:10]],
                         [l[0] for l in tr.LANGUAGES])
        self.assertEqual([tr.planned_language(d)[0] for d in valid[10:20]],
                         [l[0] for l in tr.LANGUAGES])
        self.assertFalse(tr.recruitment_day(date(2027, 1, 1)))

    def test_only_recruitment_days_and_short_lookahead(self):
        self.assertFalse(tr.recruitment_day(date(2026, 11, 9)))
        self.assertFalse(tr.recruitment_day(date(2026, 11, 12)))
        self.assertTrue(tr.recruitment_day(date(2026, 11, 11)))
        self.assertEqual(tr.dates_to_check(date(2026, 11, 9)), (date(2026, 11, 10),))
        self.assertEqual(tr.dates_to_check(date(2026, 11, 12)), ())

    def test_timezone(self):
        due = tr.due_at(date(2026, 11, 10))
        self.assertEqual((due.hour, due.minute), (9, 15))

    def test_platform_copy_is_not_identical(self):
        for lang in tr.LANGUAGES:
            posts = tr.prepared_copy(lang)
            self.assertNotEqual(posts["x"].lower(), posts["threads"].lower())
            self.assertIn("Continuum", posts["x"])
            self.assertIn("Continuum", posts["threads"])

    def test_disallows_guaranteed_students_and_fake_launch(self):
        lang = tr.LANGUAGES[1]
        self.assertFalse(tr.native_text_ok("Teach English at Continuum: guaranteed students and income!", lang, "x"))
        self.assertFalse(tr.native_text_ok("Teach English at Continuum: available on the app store today!", lang, "x"))
        self.assertFalse(tr.native_text_ok("Continuum is preparing", lang, "x"))

    def test_cta_only_approved_https(self):
        with patch.dict(os.environ, {"CONTINUUM_TEACHER_URL": "http://unsafe.test"}):
            with self.assertRaises(ValueError):
                tr.safe_teacher_url()
        with patch.dict(os.environ, {"CONTINUUM_TEACHER_URL": "https://example.com/apply"}):
            self.assertEqual(tr.safe_teacher_url(), "https://example.com/apply")
        with patch.dict(os.environ, {"CONTINUUM_TEACHER_URL": ""}):
            self.assertEqual(tr.safe_teacher_url(), "")

    def test_dedupe_scheduled_post(self):
        due = datetime(2026, 11, 10, 9, 15, tzinfo=timezone.utc)
        def answer(query, token):
            return {"posts": {"edges": [{"node": {"id": "old", "channelId": "x",
                        "dueAt": "2026-11-10T09:15:00Z"}}]}}
        with patch.object(tr, "buffer_query", side_effect=answer):
            self.assertTrue(tr.existing_slot("key", {"id": "x", "orgId": "o"}, due))
            self.assertFalse(tr.existing_slot("key", {"id": "threads", "orgId": "o"}, due))

    def test_ai_fallback_when_key_missing(self):
        with patch.dict(os.environ, {"OPENAI_API_KEY": ""}):
            posts, method = tr.generate_pair(date(2026, 11, 10), tr.LANGUAGES[0])
        self.assertEqual(method, "curated-no-openai-key")
        self.assertEqual(posts, tr.prepared_copy(tr.LANGUAGES[0]))

    def test_ai_returns_valid_language_specific_pair(self):
        valid = tr.prepared_copy(tr.LANGUAGES[0])
        fake = {"output": [{"content": [{"type": "output_text",
                 "text": json.dumps(valid, ensure_ascii=False)}]}]}
        with patch.dict(os.environ, {"OPENAI_API_KEY": "dummy"}), \
             patch.object(tr, "api_json", return_value=fake):
            posts, method = tr.generate_pair(date(2026, 11, 10), tr.LANGUAGES[0])
        self.assertEqual(method, "AI-generated")
        self.assertEqual(posts, valid)

    def test_bad_ai_content_falls_back(self):
        fake = {"output": [{"content": [{"type": "output_text",
                 "text": json.dumps({"x": "Continuum English: guaranteed students and income",
                                      "threads": "unrelated"})}]}]}
        with patch.dict(os.environ, {"OPENAI_API_KEY": "dummy"}), \
             patch.object(tr, "api_json", return_value=fake):
            posts, method = tr.generate_pair(date(2026, 11, 10), tr.LANGUAGES[0])
        self.assertEqual(method, "curated-fallback")
        self.assertEqual(posts, tr.prepared_copy(tr.LANGUAGES[0]))

    def test_metric_scope_ignores_non_teacher_posts(self):
        def answer(query, token):
            return {"posts": {"edges": [{"node": {
                "text": "Language tip with reactions", "metricsUpdatedAt": "now",
                "metrics": [{"type": "impressions", "value": 100}, {"type": "reactions", "value": 30}]
            }}]}}
        chans = {"x": {"id": "a", "orgId": "o"}, "threads": {"id": "b", "orgId": "o"}}
        with patch.object(tr, "buffer_query", side_effect=answer):
            self.assertEqual(tr.teacher_metrics_brief("key", chans, date(2026, 11, 10)), "")

    def test_dry_run_no_external_calls(self):
        with patch("sys.argv", ["teacher_recruitment.py", "--date", "2026-11-10", "--dry-run"]), \
             patch.object(tr, "buffer_query", side_effect=AssertionError("Buffer called")), \
             patch.object(tr, "api_json", side_effect=AssertionError("OpenAI called")):
            tr.main()


if __name__ == "__main__":
    unittest.main()
