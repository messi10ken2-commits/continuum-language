import XCTest

final class NativeUITests: XCTestCase {
    func testSharedAccountPersistsInKeychainAndLogoutClearsIt() throws {
        continueAfterFailure = false
        let app = XCUIApplication(bundleIdentifier: "com.continuum.language.dev")
        app.launch()
        func tap(_ title: String, last: Bool = false) {
            let buttons = app.webViews.buttons.matching(NSPredicate(format: "label == %@", title))
            let button = last ? buttons.element(boundBy: max(0, buttons.count - 1)) : buttons.firstMatch
            XCTAssertTrue(button.waitForExistence(timeout: 90), title)
            let keyboard = app.keyboards.firstMatch
            func unobstructed() -> Bool {
                button.isHittable && (!keyboard.exists || !button.frame.intersects(keyboard.frame))
            }
            for _ in 0..<12 {
                if unobstructed() { break }
                app.webViews.firstMatch.swipeUp()
            }
            XCTAssertTrue(unobstructed(), "\(title) must be visible above the keyboard")
            button.tap()
        }
        tap("Already a member? Sign in")
        let email = app.webViews.textFields["Email"]
        XCTAssertTrue(email.waitForExistence(timeout: 20))
        email.tap(); email.typeText("native-e2e@example.test")
        let password = app.webViews.secureTextFields.firstMatch
        password.tap(); password.typeText("native-e2e-password-123")
        tap("Sign in", last: true)
        let signedIn = XCTAttachment(screenshot: app.screenshot()); signedIn.name = "After sign-in attempt"; signedIn.lifetime = .keepAlways; add(signedIn)
        print("NATIVE_SIGNIN_ACCESSIBILITY", app.debugDescription)
        tap("Account")
        XCTAssertTrue(app.webViews.staticTexts.matching(NSPredicate(format: "label CONTAINS %@", "Native QA learner")).firstMatch.waitForExistence(timeout: 90))
        app.terminate(); app.launch()
        tap("Account")
        XCTAssertTrue(app.webViews.staticTexts.matching(NSPredicate(format: "label CONTAINS %@", "Native QA learner")).firstMatch.waitForExistence(timeout: 90))
        let screenshot = XCTAttachment(screenshot: app.screenshot()); screenshot.name = "Native account restored from Keychain"; screenshot.lifetime = .keepAlways; add(screenshot)
        XCUIDevice.shared.orientation = .landscapeLeft
        let landscape = XCTAttachment(screenshot: app.screenshot()); landscape.name = "Native account in landscape"; landscape.lifetime = .keepAlways; add(landscape)
        XCUIDevice.shared.orientation = .portrait
        tap("Sign out")
        XCTAssertTrue(app.webViews.buttons["Already a member? Sign in"].waitForExistence(timeout: 90))
        app.terminate(); app.launch()
        XCTAssertTrue(app.webViews.buttons["Already a member? Sign in"].waitForExistence(timeout: 90))
    }
    func testStoreScreenshotsUseSyntheticAccount() throws {
        continueAfterFailure = false
        XCUIDevice.shared.orientation = .portrait
        let app = XCUIApplication(bundleIdentifier: "com.continuum.language.dev")
        app.launch()
        func tapVisible(_ title: String) {
            let matches = app.webViews.buttons.matching(NSPredicate(format: "label == %@", title))
            XCTAssertTrue(matches.firstMatch.waitForExistence(timeout: 90), title)
            for _ in 0..<12 {
                if let button = matches.allElementsBoundByIndex.reversed().first(where: { $0.isHittable && (!app.keyboards.firstMatch.exists || !$0.frame.intersects(app.keyboards.firstMatch.frame)) }) { button.tap(); return }
                app.webViews.firstMatch.swipeUp()
            }
            XCTFail("No accessible button: \(title)")
        }
        tapVisible("Already a member? Sign in")
        let email = app.webViews.textFields["Email"]
        XCTAssertTrue(email.waitForExistence(timeout: 20))
        email.tap(); email.typeText("store-demo@example.test")
        let password = app.webViews.secureTextFields.firstMatch
        password.tap(); password.typeText("store-demo-fixture-123")
        tapVisible("Sign in")
        for (index, screen, heading) in [(1, "Overview", "Your course progress"), (2, "Learn", "Chapters"), (3, "Practice", "Practice Studio"), (4, "Classes", "Your classes and practice")] {
            tapVisible(screen)
            XCTAssertTrue(app.webViews.staticTexts.matching(NSPredicate(format: "label CONTAINS %@", heading)).firstMatch.waitForExistence(timeout: 90), heading)
            let image = XCTAttachment(screenshot: app.screenshot())
            image.name = "Store-EN-0\(index)-\(screen)"
            image.lifetime = .keepAlways
            add(image)
        }
        tapVisible("Account")
        tapVisible("Sign out")
    }

}
