import json
import unittest
from datetime import date, datetime, timedelta, timezone
from unittest.mock import patch
from social_automation.poster import (KEYS, FIRST_DAY_INTROS, FIRST_DAY_TIP_KEYS,
                                     ROTATION, first_day, multilingual_plan, generate,
                                     target_datetimes, validate, demo_posts,
                                     with_link, content_schema, schedule, scheduled_slots,
                                     discover_channels, posting_dates, missing_future_slots,
                                     PRELAUNCH_PROGRESS_FACTS, EVENING_PROGRESS_ANGLES,
                                     evening_progress_angle)

class TestPoster(unittest.TestCase):
    def test_prelaunch_brief_stays_specific_and_cautious(self):
        self.assertIn('IN DEVELOPMENT', PRELAUNCH_PROGRESS_FACTS)
        self.assertIn('teacher feedback', PRELAUNCH_PROGRESS_FACTS)
        self.assertIn('mobile usability', PRELAUNCH_PROGRESS_FACTS)
        self.assertIn('payments/payouts', PRELAUNCH_PROGRESS_FACTS)
        self.assertGreaterEqual(len(EVENING_PROGRESS_ANGLES), 6)
        self.assertEqual(evening_progress_angle(date(2026, 10, 27)),
                         EVENING_PROGRESS_ANGLES[0])
        self.assertEqual(evening_progress_angle(date(2026, 11, 3)),
                         EVENING_PROGRESS_ANGLES[0])

    @patch('social_automation.poster.api_json')
    def test_evening_prompt_describes_current_progress_without_touching_tips(self, mock_api):
        english = demo_posts()
        localized = {
            'x_morning': 'Viaje ao Japão? Diga すみません para chamar alguém com educação. Uma frase muito prática.',
            'threads_morning': 'Uma expressão útil no Japão: すみません. Você pode dizer isso ao chamar a atenção de alguém educadamente.',
        }
        mock_api.side_effect = [
            {'output': [{'content': [{'type': 'output_text',
                                      'text': json.dumps(english, ensure_ascii=False)}]}]},
            {'output': [{'content': [{'type': 'output_text',
                                      'text': json.dumps(localized, ensure_ascii=False)}]}]},
        ]
        with patch.dict('os.environ', {'OPENAI_API_KEY': 'fake', 'INTRO_POST_DATE': '2026-10-19'}):
            result = generate(date(2026, 10, 28))
        prompt = mock_api.call_args_list[0].args[1]['input']
        self.assertIn('x_evening and threads_evening ONLY', prompt)
        self.assertIn('late-stage', prompt)
        self.assertIn('human-taught', prompt)
        self.assertIn('Morning: a practical Japanese travel mini-lesson', prompt)
        self.assertIn('Afternoon: an engaging language-learning insight', prompt)
        self.assertEqual(result['x_evening'], english['x_evening'])
        self.assertEqual(result['threads_evening'], english['threads_evening'])
        self.assertEqual(result['x_morning'], localized['x_morning'])
        self.assertEqual(result['threads_morning'], localized['threads_morning'])

    def test_launch_intro_is_first_for_each_network(self):
        with patch.dict('os.environ', {'INTRO_POST_DATE': '2026-10-19'}):
            self.assertTrue(first_day(date(2026, 10, 19)))
            self.assertFalse(first_day(date(2026, 10, 20)))
        self.assertEqual(set(FIRST_DAY_INTROS), {'x_morning', 'threads_morning'})
        self.assertIn('Kotoba is live', FIRST_DAY_INTROS['x_morning'])
        self.assertIn('in development', FIRST_DAY_INTROS['threads_morning'])
        self.assertEqual(len(FIRST_DAY_TIP_KEYS), 4)
        self.assertEqual(len(KEYS), 6)
        for key, text in FIRST_DAY_INTROS.items():
            self.assertLessEqual(len(text), 235 if key.startswith('x_') else 365)

    def test_default_recovery_window_and_manual_modes(self):
        day = date(2026, 10, 20)
        self.assertEqual(posting_dates(day),
                         (date(2026, 10, 20), date(2026, 10, 21),
                          date(2026, 10, 22)))
        self.assertEqual(posting_dates(day, dry_run=True),
                         (date(2026, 10, 21),))
        self.assertEqual(posting_dates(day, explicit_date=date(2026, 10, 23)),
                         (date(2026, 10, 23),))

    def test_recovery_skips_past_and_previously_scheduled_slots(self):
        # At 14:23 in Kuala Lumpur the 09:00 slot is already too late.
        now = datetime(2026, 10, 20, 6, 23, tzinfo=timezone.utc)
        needed = missing_future_slots(date(2026, 10, 20),
                                      {('x', 'afternoon')}, now)
        self.assertEqual(needed, {
            ('threads', 'afternoon'),
            ('x', 'evening'),
            ('threads', 'evening'),
        })
        # Posts should not be inserted just a few minutes before publish time.
        close_to_slot = datetime(2026, 10, 20, 6, 55, tzinfo=timezone.utc)
        needed = missing_future_slots(date(2026, 10, 20), set(), close_to_slot)
        self.assertEqual(needed, {('x', 'evening'), ('threads', 'evening')})

    def test_future_dates_are_fully_eligible_for_recovery(self):
        now = datetime(2026, 10, 20, 6, 23, tzinfo=timezone.utc)
        self.assertEqual(missing_future_slots(date(2026, 10, 21), set(), now),
                         {(platform, slot) for platform in ('x', 'threads')
                          for slot in ('morning', 'afternoon', 'evening')})

    @patch('social_automation.poster.api_json')
    def test_launch_generates_only_four_receipt_tips(self, mock_api):
        tips = {k: f"{k} Travel Japanese: レシートをください means 'May I have a receipt, please?'"
                for k in FIRST_DAY_TIP_KEYS}
        mock_api.return_value = {'output': [{'content': [{'type': 'output_text', 'text': json.dumps(tips)}]}]}
        with patch.dict('os.environ', {'OPENAI_API_KEY': 'fake', 'INTRO_POST_DATE': '2026-10-19'}):
            posts = generate(date(2026, 10, 19))
        self.assertEqual(len(posts), 6)
        self.assertEqual(posts['x_morning'], FIRST_DAY_INTROS['x_morning'])
        self.assertEqual(posts['threads_morning'], FIRST_DAY_INTROS['threads_morning'])
        self.assertEqual(set(posts)-set(FIRST_DAY_INTROS), set(FIRST_DAY_TIP_KEYS))
        self.assertIn('ONLY four remaining posts', mock_api.call_args.args[1]['input'])
        self.assertEqual(len(mock_api.call_args.args[1]['text']['format']['schema']['required']), 4)

    def test_first_day_blocks_promo_links(self):
        with patch.dict('os.environ', {'INTRO_POST_DATE': '2026-10-19', 'KOTOBA_URL': 'https://example.org'}):
            self.assertEqual(with_link('hello', 'x', 'morning', date(2026, 10, 19)), 'hello')


    def test_rotates_same_language_across_x_and_threads(self):
        with patch.dict('os.environ', {'INTRO_POST_DATE': '2026-10-19'}):
            self.assertIsNone(multilingual_plan(date(2026, 10, 19)))
            self.assertEqual(ROTATION, ('Japanese', 'Portuguese', 'Spanish',
                                        'French', 'Simplified Chinese'))
            expected = [
                ('Japanese', ('x_evening', 'threads_evening')),
                ('Portuguese', ('x_morning', 'threads_morning')),
                ('Spanish', ('x_morning', 'threads_morning')),
                ('French', ('x_morning', 'threads_morning')),
                ('Simplified Chinese', ('x_morning', 'threads_morning')),
                ('Japanese', ('x_evening', 'threads_evening')),
            ]
            for offset, plan in enumerate(expected):
                self.assertEqual(multilingual_plan(date(2026, 10, 20) +
                                 __import__('datetime').timedelta(days=offset)), plan)

    @patch('social_automation.poster.api_json')
    def test_japanese_dev_posts_only_and_four_english_posts(self, mock_api):
        english = demo_posts()
        localized = {
            'x_evening': 'Continuumは現在開発中。AI学習と先生との授業をつなぎ、学んだことが積み重なる仕組みを目指しています。',
            'threads_evening': '言語学習の進歩が、先生との授業と自習で途切れない世界へ。Continuumはその実現を目指して開発を進めています。完成までの道のりを共有します。',
        }
        mock_api.side_effect = [
            {'output': [{'content': [{'type': 'output_text', 'text': json.dumps(english, ensure_ascii=False)}]}]},
            {'output': [{'content': [{'type': 'output_text', 'text': json.dumps(localized, ensure_ascii=False)}]}]},
        ]
        with patch.dict('os.environ', {'OPENAI_API_KEY': 'fake', 'INTRO_POST_DATE': '2026-10-19'}):
            result = generate(date(2026, 10, 20))
        self.assertEqual(mock_api.call_count, 2)
        self.assertEqual(result['x_evening'], localized['x_evening'])
        self.assertEqual(result['threads_evening'], localized['threads_evening'])
        for key in set(KEYS) - set(localized):
            self.assertEqual(result[key], english[key])
        locale_prompt = mock_api.call_args.args[1]['input']
        self.assertIn('NOT a Japanese', locale_prompt)
        self.assertIn('Japanese', locale_prompt)

    @patch('social_automation.poster.api_json')
    def test_portuguese_pair_only(self, mock_api):
        english = demo_posts()
        localized = {
            'x_morning': 'Em japonês, すみません serve para chamar a atenção de alguém com educação. Uma frase útil para viajar.',
            'threads_morning': 'Vai viajar ao Japão? Experimente dizer すみません (sumimasen) para chamar alguém de forma educada. Onde usaria essa expressão?',
        }
        mock_api.side_effect = [
            {'output': [{'content': [{'type': 'output_text', 'text': json.dumps(english, ensure_ascii=False)}]}]},
            {'output': [{'content': [{'type': 'output_text', 'text': json.dumps(localized, ensure_ascii=False)}]}]},
        ]
        with patch.dict('os.environ', {'OPENAI_API_KEY': 'fake', 'INTRO_POST_DATE': '2026-10-19'}):
            result = generate(date(2026, 10, 21))
        self.assertEqual(result['x_morning'], localized['x_morning'])
        self.assertEqual(result['threads_morning'], localized['threads_morning'])
        self.assertEqual(result['x_evening'], english['x_evening'])
        self.assertEqual(result['threads_evening'], english['threads_evening'])
        self.assertEqual(mock_api.call_args.args[1]['text']['format']['schema']['required'],
                         ['x_morning', 'threads_morning'])

    @patch('social_automation.poster.api_json')
    def test_launch_day_still_has_intros_and_one_api_call(self, mock_api):
        tips = {k: f'{k} レシートをください means May I have a receipt, please in Japanese'
                for k in FIRST_DAY_TIP_KEYS}
        mock_api.return_value = {'output': [{'content': [{'type': 'output_text',
                                                        'text': json.dumps(tips, ensure_ascii=False)}]}]}
        with patch.dict('os.environ', {'OPENAI_API_KEY': 'fake', 'INTRO_POST_DATE': '2026-10-19'}):
            result = generate(date(2026, 10, 19))
        self.assertEqual(mock_api.call_count, 1)
        for key, value in FIRST_DAY_INTROS.items():
            self.assertEqual(result[key], value)

    def test_multilingual_slot_does_not_get_link(self):
        with patch.dict('os.environ', {'INTRO_POST_DATE':'2026-10-19',
                                       'CONTINUUM_URL':'https://example.org',
                                       'KOTOBA_URL':'https://example.org'}):
            # Check on the first fourth-day link opportunity within the rotation.
            from datetime import timedelta
            for n in range(1, 21):
                day = date(2026, 10, 19) + timedelta(days=n)
                lang, keys = multilingual_plan(day)
                for key in keys:
                    platform, slot = key.split('_', 1)
                    self.assertEqual(with_link('The localized post stays intact', platform, slot, day),
                                     'The localized post stays intact')

    def test_six_keys(self):
        self.assertEqual(len(KEYS), 6)
        self.assertEqual(len(content_schema()['required']), 6)

    def test_scheduled_utc_conversion(self):
        times = target_datetimes(date(2026, 10, 18))
        self.assertEqual((times['morning'].hour, times['afternoon'].hour, times['evening'].hour), (1, 7, 13))

    def test_valid_demo(self):
        self.assertEqual(len(validate(demo_posts())), 6)

    def test_reject_long_x(self):
        posts = demo_posts()
        posts['x_morning'] = 'x' * 236
        with self.assertRaises(ValueError):
            validate(posts)

    def test_reject_urls_from_ai(self):
        posts = demo_posts()
        posts['threads_morning'] += ' https://fake.example'
        with self.assertRaises(ValueError):
            validate(posts)

    def test_no_url_when_not_set(self):
        with patch.dict('os.environ', {'KOTOBA_URL': ''}):
            self.assertEqual(with_link('hello', 'x', 'morning', date(2026, 10, 20)), 'hello')

    def test_no_url_on_nonpromo_slot(self):
        with patch.dict('os.environ', {'KOTOBA_URL': 'https://example.org'}):
            self.assertEqual(with_link('hello', 'x', 'afternoon', date(2026, 10, 20)), 'hello')

    @patch('social_automation.poster.buffer_query')
    def test_discovers_only_connected_channels(self, mock_query):
        mock_query.side_effect = [
            {'account': {'organizations': [{'id': 'org_1', 'name': 'Brand'}]}},
            {'channels': [
                {'id':'x1','name':'brand','service':'twitter','isDisconnected':False,'isLocked':False,'isQueuePaused':False},
                {'id':'t1','name':'brand','service':'threads','isDisconnected':False,'isLocked':False,'isQueuePaused':False},
            ]},
        ]
        chosen = discover_channels('test_key')
        self.assertEqual(chosen['x']['id'], 'x1')
        self.assertEqual(chosen['threads']['id'], 't1')

    def assert_graphql_balanced(self, query):
        stack = []
        expected = {')': '(', '}': '{', ']': '['}
        in_string = False
        escaped = False
        for ch in query:
            if in_string:
                if escaped:
                    escaped = False
                elif ch == "\\":
                    escaped = True
                elif ch == '"':
                    in_string = False
            elif ch == '"':
                in_string = True
            elif ch in '({[':
                stack.append(ch)
            elif ch in ')}]':
                self.assertTrue(stack, f'Unmatched closing {ch} in GraphQL query')
                self.assertEqual(stack.pop(), expected[ch], f'Malformed GraphQL query before {ch}')
        self.assertFalse(in_string, 'Unterminated quoted value')
        self.assertEqual(stack, [], 'Unclosed GraphQL delimiters')

    @patch('social_automation.poster.buffer_query')
    def test_prevents_rescheduling_same_slots(self, mock_query):
        channels = {'x':{'id':'x1','orgId':'org_1'}, 'threads':{'id':'t1','orgId':'org_1'}}
        mock_query.return_value={'posts': {'edges': [
            {'node':{'id':'p1','channelId':'x1','dueAt':'2026-10-18T01:00:00.000Z'}},
            {'node':{'id':'p2','channelId':'t1','dueAt':'2026-10-18T13:00:00.000Z'}},
        ]}}
        found=scheduled_slots('test_key', channels, date(2026,10,18))
        self.assertEqual(found,{('x','morning'),('threads','evening')})
        self.assert_graphql_balanced(mock_query.call_args.args[0])
        self.assertIn('status: [scheduled, sent]', mock_query.call_args.args[0])

    @patch('social_automation.poster.buffer_query')
    def test_create_post_uses_expected_graphql(self, mock_query):
        mock_query.return_value={'createPost':{'post':{'id':'scheduled_1'}}}
        post_id=schedule('test_key','x1','Hello there',target_datetimes(date(2026,10,18))['morning'])
        self.assertEqual(post_id, 'scheduled_1')
        query=mock_query.call_args.args[0]
        self.assert_graphql_balanced(query)
        self.assertIn('schedulingType: automatic',query)
        self.assertIn('dueAt: "2026-10-18T01:00:00.000Z"',query)

if __name__ == '__main__':
    unittest.main()
