# Senior Design: Smart Billboard

Clone the repo to a local folder in your computer. **Note:** The current files work on unix environment.
The app uses the react-native framework. To successfully run and install dependencies, the most recent versions of "yarn" and "nodejs" need to be installed.



# Windows Environment: Using Powershell
## Installation instructions for Windows:
### Installing Git:
  1. Git can be installed from the [Git Homepage](https://git-scm.com/downloads). I recommend using Git GUI for commits and so forth.
### Installing NodeJS:
  1. Download the msi from the [Node Homepage](https://nodejs.org/en/download/releases/). **WARNING:** Download version 12.9.1 as there is an issue with path termination in Windows. If developing on a linux machine or Mac, the latest stable version will suffice.
  2. During installation verify that node is added to PATH, and available on the terminal prompt.
### Installing Yarn:
  1. Download the msi from the [yarn homepage](https://yarnpkg.com/lang/en/docs/install/#windows-stable)


## Setting up the project:

  1. Download the project from github, by either cloning it to a local folder, or downloading and extracting the zip file.
  2. Change the active repository to the project folder. Enter the following commands:
      - yarn global add expo-cli
      - yarn install
  2. To run the development  system, enter the following:

      - yarn web

  3. After the command completes, a new tab in your browser will open up with "expo-cli".
  ```diff
  -[WARNING:] There may be an issue accessing the application through the expo app on the phone.
  -This will happen due to the windows firewall for public networks. When using your home wifi, verify
  -that connection is listed as private connection.
  ```
# VSCode Setup
  1. Download the following extensions: Eslint by Dirk Baeumer and Prettier by Esben Petersen.
  2. Set VSCode to use the workspace settings. This can be done by clicking File -> Preferences -> Settings and clicking on "Workspace" below the search bar.

  After doing this, VSCode should automatically format on save and lint.