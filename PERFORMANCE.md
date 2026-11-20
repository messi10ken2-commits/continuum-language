# Translation and audio response improvements

Translation cache lookups now use one SQL query for up to 16 entries instead of
one serial round trip per entry. Newly translated entries are persisted in one
atomic batch, with duplicate cache keys collapsed for PostgreSQL compatibility.
Context, learning-language protections, provider models, reviewed copy and
cache versioning remain unchanged.

During requested audio playback, the next segment is fetched while the current
segment plays. Only one segment is prepared ahead; page rendering does not
generate audio. Cancelling playback aborts the lookahead request, and failures
are handled when the segment is needed. Provider-side work already accepted
may still finish and be cached after cancellation. A learner stopping early
may therefore generate one unused segment. Existing generation limits remain.

The regression tests verify a warm 16-entry batch requires one DB query instead
of 16, and a cold batch uses one read and one write instead of up to 32 queries.
Audio tests verify ordering, bounded lookahead, cancellation and error handling.
These are deterministic work-count improvements, not measured production latency.
The first uncached translation/audio request still depends on provider latency;
voice quality, speech speed and pedagogical content have not been reduced.

Deploy only after the feature branch passes Validate application and is reviewed.
Railway should deploy the approved main commit through its GitHub integration.
No Railway API token or production secret is required by this change. Verify the
actual Railway deployment commit and status before declaring the site updated.
