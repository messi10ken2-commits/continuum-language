import json
import unittest
from datetime import date
from unittest.mock import patch
from social_automation.poster import (KEYS, FIRST_DAY_INTROS, FIRST_DAY_TIP_KEYS,
                                     first_day, generate, target_datetimes, validate, demo_posts,
                                     with_link, content_schema, schedule, scheduled_slots,
                                     discover_channels)

class TestPoster(unittest.TestCase):
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
