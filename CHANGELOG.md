# Change Log

## 2.1

**Features:**

- Multi language support
  > When Superdesk is configured for many languages (language vocabulary is present) Publisher will add a language code label to items in output control and allow filtering articles by language.
  > New `default language` setting in tenant general setting will appear. Therefore articles in manual content lists will be filtered by that language by default.
- Error Log
  > This is a new view that will collect and show all errors coming from Publisher including stacktrace and exact error messages for developers.
- Analytics report generation
  > From Analytics view there is an option to generate CSV report based on defined criteria. Once report is generated notification email with download link will be sent to an user. Reports can be downloaded from `reports history` view as well.
- Route Redirects
  > This new feature allows to define redirects for existing routes or completely custom redirect from URI to URI. Permanent (301 http code) or temporary (302 http code) type of redirect can be picked.
- Notification when manual content list limit is exceeded
  > Visual notification will appear once limit is set for a content list and user exceeds that limit by putting too many items. It is now clearly visible which articles are above the limit and therefore will be removed once list is saved.
- Ability to remove item from automatic content lists
  > It is now possible to manually remove an article that matches automatic content list criteria but is unwanted.
- Ability to set automatic content list criteria based on predefined and custom vocabularies.
- Ability to create custom route with variable (used for dynamic pages like Author or Tag pages. Theme has to support it)
- Ability to create menu item based on custom route. New UI that allows to set custom variable or select author will appear once custom route is picked in create menu item form.
- Publishing to Apple News
- Pinning on manual content lists
  > Allows to pin an article and preserve its position.
- Article republish
  > Allows republishing of an article that was unpublished before.

**Improvements/Fixes:**

- Output Control UI improved and rewritten to React `(speed improvement)`
- Dashboard rewritten to React `(speed improvement)`
- Preview pane rewritten to React `(speed improvement)`
- New gallery component `(speed improvement)`
- Article author names are displayed in preview
- Location assigned to package displayed in output control
- Big numbers formatted properly
- Content Lists UI was blocked when adding multiple lists
- Output Control: incoming content remove confirmation was malfunctioning
- Every author input replaced with auto suggestion select
- Embeds in article preview
- Selectable ingest source in filtering
