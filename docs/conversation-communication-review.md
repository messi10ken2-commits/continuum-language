# Communication review recovery

Communication scoring is independent of correction verification. Four assessed ratings must reference saved learner turns; the server copies the actual learner text. Invalid corrections and unsupported goal claims are still omitted, but cannot erase an independently grounded communication score. Legacy scores without verified evidence remain unavailable until reassessed.

Reassess communication performs one focused scoring operation instead of rebuilding the full review and auditing corrections again. Completed transcripts accept a stale client revision for this operation; ownership, consent, the server revision lock and cached successful results remain enforced. Pronunciation is calculated only from recorded audio, and the combined speaking score requires both communication and pronunciation evidence.

Full reviews use a shared 26-second provider deadline. Optional correction checks and score repair run concurrently within an eight-second window. Focused reassessment has a 12-second total provider deadline and an eight-second per-provider timeout. Browser review requests stop waiting after 40 seconds, release the controls and retain the saved conversation and pronunciation. Score progress is shown inside the existing review; retry stays on the focused scoring path.

Regression coverage includes source-turn evidence, rejected corrections, insufficient evidence, provider failure, shared deadlines, authenticated reassessment and cached retries. Mobile Chromium and WebKit exercise the real review component with controlled successful, failed and stalled responses. No score is fabricated when evidence or the provider is unavailable.
