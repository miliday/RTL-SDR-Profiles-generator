# OpenWebRX Profile Generator

The Profile Generator allows you to create configuration profiles for RTL-SDR with various settings for frequency, modulation, and tuning steps.
[DOWNLOAD OpenWebRX Profile Generator](https://github.com/miliday/RTL-SDR-Profiles-generator/archive/refs/heads/main.zip)


## Installation

Before starting, make sure that Node.js is installed on your machine. If it is not, first install it from the official [Node.js website](https://nodejs.org/).
**node version 18.xx.xx**

1. Clone the repository or download the source code of the program.

   ```
   git clone https://github.com/miliday/RTL-SDR-Profiles-generator
   ```

2. Navigate to the program's folder.

   ```
   cd [path to the program folder]
   ```

3. Install the necessary dependencies.

   ```
   npm install
   ```

## Usage

To run the program, execute the following command in the terminal:

```
node generate.mjs
```

or

```
npm start
```

After launching, the program will perform the following steps:

1. **Welcome Message** – The user will be shown a welcome message and brief information about the program.

2. **Readiness Confirmation** – The program will ask if you are ready to start generating profiles.

3. **Frequency Range Input**:
   - **Start Frequency (startFreq)** – Enter the start frequency in MHz for your range.
   - **End Frequency (endFreq)** – Enter the end frequency in MHz, which should be greater than the start frequency.

4. **Profile Name Configuration**:
   - **Prefix (prefixName)** – Enter the text to be added before the name of each profile.
   - **Postfix (suffixName)** – Enter the text to be added after the name of each profile.

5. **Option Selection**:
   - **Sample Rate (sampRate)** – Select one of the provided sample rate options.
   - **Modulation Type (startMod)** – Choose the modulation type from the provided options.
   - **Tuning Step (tuningStep)** – Choose the tuning step from the available options.

After completing all data entries, the program will generate a `profiles.json` file containing all created profiles. The file will automatically open in Visual Studio Code for your convenience.

## Help and Support

If you have any questions or issues while using the program, please seek help through the issue system in the GitHub repository.
