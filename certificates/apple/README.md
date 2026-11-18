# App Store verification trust anchor

`AppleRootCA-G3.pem` is the public Apple Root CA G3 certificate downloaded from https://www.apple.com/certificateauthority/AppleRootCA-G3.cer and converted from DER to PEM. Official index: https://www.apple.com/certificateauthority/.

SHA-256 fingerprint: `63:34:3A:BF:B8:9A:6A:03:EB:B5:7E:9B:3F:5F:A7:BE:7C:4F:5C:75:6F:30:17:B3:A8:C4:88:C3:65:3E:91:79`.

The official Apple verifier validates the signing chain, Apple signing OIDs, environment, bundle ID and production app ID. Online revocation checks are enabled for actual services. Only this pinned Apple root is trusted in application code. Synthetic test roots are generated at runtime in a temporary folder, used only by injected test services and removed afterwards. They are never accepted by the production service factory. Recheck Apple's trust anchors on SDK/certificate updates; an unrecognized chain fails closed.
