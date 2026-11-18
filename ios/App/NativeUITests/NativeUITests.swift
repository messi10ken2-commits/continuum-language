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
            for _ in 0..<12 { if button.isHittable { break }; app.swipeUp() }
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
}
