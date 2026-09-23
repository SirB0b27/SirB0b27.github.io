# Portfolio Voice & Build Checklist

This file defines the writing style for the portfolio and resume.

## Voice

- Keep sentences direct and easy to read.
- Use plain professional language instead of polished-sounding filler.
- Prefer concrete verbs such as Built, Updated, Automated, Created, Fixed, Added, Reviewed, Worked with, and Supported.
- Keep technical terms when they are needed to explain the work.
- Use exact tools, systems, and outcomes instead of broad claims.
- Avoid wording that sounds inflated, generic, or written only to sound impressive.
- Do not invent impact, metrics, responsibilities, technologies, or business results.
- Resume wording should sound professional, but still natural and close to how Hemanth explains his work.
- Favor short paragraphs and readable bullets over dense blocks of text.
- When a sentence becomes too long, split it instead of stacking more clauses.

## Words and patterns to review

These are not automatically wrong, but they should be checked because they often make portfolio copy sound generic:

- leverage / leveraged
- utilize / utilized
- robust
- seamless
- holistic
- comprehensive
- transformative
- cutting-edge
- dynamic landscape
- unlock
- elevate
- synergize / synergy
- actionable insights
- end-to-end when a simpler description works
- strategic when the exact decision or action can be named instead

## Resume rules

- Keep every claim grounded in actual experience.
- Use the same base facts across every template.
- Template changes should affect layout, typography, color, spacing, alignment, and photo placement, not the truth of the content.
- Body text should remain readable and use comfortable line spacing.
- Summary and longer descriptive text should be justified when the template layout allows it.
- Keep the printed PDF to one Letter-size page unless the user explicitly changes that requirement.
- Photos are optional and are stored locally in the browser, not committed to the public repository.
- Never overwrite the base resume when a future job-specific version is created.

## Build check

Before each GitHub build:

1. Run the content audit.
2. Run the static regression test.
3. Review new or changed public-facing copy for the voice rules above.
4. Check the Resume page at minimum:
   - all 15 Reactive Resume template names are present;
   - template selection changes the layout;
   - PDF/print hides site controls;
   - text remains readable;
   - photo add/select/delete works;
   - no photo is shown when "No photo" is selected.
5. Re-check the Personal login flow whenever Personal files change.
