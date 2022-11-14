# ToCheckList - Created using Tauri + Next.js + Typescript + MUI

This is a basic todo list desktop app with the ability to predefine checklist templates in a config file, 
which can be shared among devs in a team.

For details on how to setup your environment to build, The Tauri quickstart guide can be followed
https://tauri.app/v1/guides/getting-started/setup/next-js

### Dev build
`npm run tauri dev`

### Release build
`npm run tauri build`

## config format
The application looks for a config.json file in the folder where the exe is located.

    config.json
    {
        "checklists": [
            {
                "name": "dev p2 workflow",
                "items": [
                    "branch off master (hotfix/p2 description",
                    "deploy to functional and test",
                    "deploy hotfix to staging and get sign-off",
                    "create pr merge into master",
                    "get risk sign-off",
                    "deploy to production and notify support",
                    "merge master into develop"
                ]
            },
            {
                "name": "dev merge party",
                "items": [
                    "ensure deploy artifacts updated",
                    "merge pr into develop",
                    "branch off develop (release/2022_Q4_Release_1)",
                    "update deploy story"
                ]
            }
        ]
    }

## preview

Initial load

![Empty](./Media/Tochecklist_empty.png)

After adding some checklists

![Empty](./Media/Tochecklist_full.png)
