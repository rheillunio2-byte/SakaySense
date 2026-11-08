<div align="center">

<img src="https://capsule-render.vercel.app/api?type=shark&height=190&color=0:071B33,50:075985,100:06B6D4&text=Contributing&fontColor=FFFFFF&fontSize=55&fontAlignY=50&animation=twinkling&stroke=38BDF8&strokeWidth=2" width="100%" />

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=16&duration=2800&pause=900&color=38BDF8&center=true&vCenter=true&width=700&lines=Every+route+starts+with+a+contribution.;Build+better+commuting+experiences.;Your+ideas+help+move+SakaySense+forward." alt="Typing SVG" />

<br/>

**Thank you for your interest in contributing to SakaySense!**

</div>

---

## 📌 Introduction

SakaySense is a public transportation information system focused on helping commuters explore destinations, discover transportation options, estimate fares, and report delays in Cagayan de Oro City.

We welcome contributions from developers, students, designers, commuters, and anyone interested in improving public transportation accessibility.

This guide explains how to contribute, report bugs, suggest improvements, and submit changes.

---

## 🌟 Ways to Contribute

There are several ways to help improve SakaySense:

- **Bug Reports:** Identify and report errors or unexpected behavior.
- **Feature Suggestions:** Recommend useful features and improvements.
- **Frontend Development:** Improve layouts, components, and responsiveness.
- **Map Improvements:** Enhance interactive map functionality and location search.
- **Route Information:** Help improve transportation route coverage and accuracy.
- **Fare Information:** Help maintain accurate and properly sourced fare information.
- **UI/UX Design:** Improve usability, accessibility, and visual presentation.
- **Documentation:** Improve setup instructions and project explanations.
- **Testing:** Identify problems and verify application functionality.

---

## 🚀 Getting Started

Before contributing, make sure you have:

- A GitHub account.
- Git installed on your computer.
- Visual Studio Code or another code editor.
- A modern web browser.
- An active internet connection for online mapping features.

### 1. Fork the Repository

Fork the SakaySense repository to your own GitHub account.

### 2. Clone Your Fork

Open your terminal:

```bash
git clone https://github.com/YOUR-USERNAME/SakaySense.git
```

Navigate to the project directory:

```bash
cd SakaySense
```

### 3. Create a Branch

Create a separate branch for your contribution:

```bash
git checkout -b feature/your-feature-name
```

Examples:

```bash
git checkout -b feature/expanded-location-search
```

```bash
git checkout -b feature/map-improvements
```

```bash
git checkout -b fix/fare-estimator
```

```bash
git checkout -b docs/update-readme
```

### 4. Open the Project

Open the project folder in Visual Studio Code.

You can run the application using the Live Server extension or the project's existing development setup.

### 5. Make Your Changes

Work on your selected feature, improvement, or fix.

Keep your changes focused and follow the project's existing structure and coding conventions.

### 6. Test Your Changes

Before committing, make sure your changes work correctly.

Test relevant features such as:

- Location searching.
- Origin and destination selection.
- Map interaction.
- Route discovery.
- Fare estimation.
- Delay reporting.
- Mobile responsiveness.

### 7. Commit Your Changes

Use a clear and descriptive commit message:

```bash
git add .
git commit -m "feat: improve destination search"
```

Other examples:

```bash
git commit -m "fix: correct fare estimation"
```

```bash
git commit -m "style: improve trip planner layout"
```

```bash
git commit -m "docs: update contributing guide"
```

### 8. Push Your Branch

```bash
git push origin feature/your-feature-name
```

### 9. Submit a Pull Request

Visit your fork on GitHub and open a Pull Request to the original SakaySense repository.

Explain what you changed, why it is useful, and how you tested it.

---

## 📏 Contribution Guidelines

### General Guidelines

- Keep contributions relevant to SakaySense.
- Write clean, readable, and maintainable code.
- Avoid unnecessary modifications to unrelated files.
- Test your changes before submitting.
- Follow the existing project structure.
- Use meaningful variable and function names.
- Provide clear descriptions of your changes.
- Be respectful when discussing suggestions and reviewing contributions.

### Frontend Guidelines

When working on the interface:

- Use semantic HTML elements.
- Keep CSS organized and reusable.
- Write readable JavaScript.
- Maintain consistent spacing, colors, and typography.
- Ensure the interface remains responsive.
- Avoid unnecessary dependencies.
- Keep animations smooth and purposeful.
- Maintain accessibility and keyboard usability.

### Map and Location Search Guidelines

When working on mapping and location features:

- Keep location search reliable and user-friendly.
- Handle failed geocoding requests gracefully.
- Respect OpenStreetMap and Nominatim usage policies.
- Avoid excessive or unnecessary API requests.
- Use clear labels for map markers.
- Do not present estimated map connections as verified transit routes.
- Do not claim live vehicle tracking without a genuine data source.
- Request browser geolocation permission only when needed and initiated by the user.

### Transportation and Fare Guidelines

When modifying transportation information:

- Use reliable sources whenever possible.
- Avoid inventing route details, fare rates, or schedules.
- Clearly identify estimated or illustrative information.
- Preserve existing transportation categories unless a change is necessary.
- Document important changes to route or fare calculations.

### Documentation Guidelines

When updating documentation:

- Use simple and understandable language.
- Keep headings and formatting consistent.
- Verify links and commands.
- Use accurate descriptions of implemented features.
- Ensure screenshot paths are correct.
- Update the project structure when files are added or removed.

---

## 🧪 Testing Your Changes

Before submitting a contribution, test the affected parts of the application.

### Application Testing

1. Open the application in a modern browser.
2. Check whether the interface loads correctly.
3. Test the modified feature.
4. Check browser console errors.
5. Test the layout on different screen sizes.
6. Verify that existing functionality remains operational.

### Map Testing

If you modify map functionality:

- Test zooming and panning.
- Test origin and destination markers.
- Test location search.
- Test map behavior when no location is found.
- Check how the interface behaves when the internet connection is unavailable.

### Fare and Route Testing

If you modify route or fare functionality:

- Test different transport options.
- Test Regular, Student, and Senior Citizen categories.
- Check calculations against the available fare data.
- Verify that missing information is handled properly.

---

## 🐛 Reporting Bugs

If you discover a bug, open an Issue in the GitHub repository.

Include the following information when possible:

1. **Title:** A short description of the issue.
2. **Description:** Explain what happened.
3. **Steps to Reproduce:** Provide the steps needed to reproduce the issue.
4. **Expected Behavior:** Describe what should happen.
5. **Actual Behavior:** Explain what happened instead.
6. **Environment:** Include your operating system and browser.
7. **Screenshots or Logs:** Attach useful evidence when available.

Please avoid including private credentials or sensitive information.

---

## 💡 Suggesting Improvements

Have an idea that could make SakaySense better?

We welcome suggestions related to:

- More comprehensive destination searching.
- Additional public transportation routes.
- Interactive map improvements.
- Better route recommendations.
- Fare estimation improvements.
- Transportation delay reporting.
- Accessibility and mobile usability.
- User experience and interface design.
- Application performance and reliability.

Open a GitHub Issue and explain the problem your suggestion addresses and how it could improve the project.

---

## 🔀 Pull Request Guidelines

Before submitting a Pull Request, make sure:

- Your changes are relevant to SakaySense.
- Your branch is based on the latest appropriate version of the repository.
- Your code follows existing conventions.
- You have tested your changes.
- You have updated documentation when necessary.
- You have not included unrelated files or sensitive credentials.
- Your Pull Request clearly explains the changes.

Keep Pull Requests focused. Smaller, well-explained contributions are easier to review.

---

## 🔐 Security and Privacy Guidelines

Please follow these practices:

- Never commit passwords, API keys, or private credentials.
- Avoid exposing personal information in reports or screenshots.
- Request location permissions only when necessary.
- Handle location information responsibly.
- Avoid introducing unnecessary security risks.
- Report potential vulnerabilities privately to the project maintainer rather than publicly disclosing sensitive details.

---

## 🤝 Code of Conduct

We want SakaySense to remain a welcoming and collaborative project.

All contributors are expected to:

- Treat others with respect.
- Welcome constructive feedback.
- Respect different opinions and ideas.
- Avoid harassment and discriminatory behavior.
- Keep discussions professional and productive.
- Help create a positive learning and development environment.

---

## 📄 License

By contributing to SakaySense, you agree that your contributions will be licensed under the project's **MIT License**.

Make sure that any code, images, or other materials you submit are your own or that you have permission to contribute them.

See the [LICENSE](LICENSE) file for details.

You can also view the license here:

[View SakaySense MIT License](https://github.com/rheillunio2-byte/SakaySense?tab=MIT-1-ov-file)

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=wave&color=0:06B6D4,50:0284C7,100:071B33&height=135&section=footer&animation=twinkling" width="100%" />

**Thank you for helping improve SakaySense!**

<sub>Better routes. Smarter journeys. Stronger communities.</sub>

</div>
