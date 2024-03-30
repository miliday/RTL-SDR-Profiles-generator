import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs';
import open from 'open';

const tuningStepDefault = 6
const tuningStepOptions = [
    { name: '1Hz', value: 1 },
    { name: '10Hz', value: 10 },
    { name: '20Hz', value: 20 },
    { name: '50Hz', value: 50 },
    { name: '100Hz', value: 100 },
    { name: '500Hz', value: 500 },
    { name: '1000Hz (default)', value: 1000 },
    { name: '2500Hz', value: 2500 },
    { name: '3000Hz', value: 3000 },
    { name: '5000Hz', value: 5000 },
    { name: '6000Hz', value: 6000 },
    { name: '6250Hz', value: 6250 },
    { name: '8330Hz', value: 8330 },
    { name: '9000Hz', value: 9000 },
    { name: '10000Hz', value: 10000 },
    { name: '12000Hz', value: 12000 },
    { name: '12500Hz', value: 12500 },
    { name: '25000Hz', value: 25000 },
    { name: '50000Hz', value: 50000 },

];

const modDefault = 0
const modOptions = [
    { name: "nfm (default)", value: "nfm" },
    { name: "wfm", value: "wfm" },
    { name: "am", value: "am" },
    { name: "lsb", value: "lsb" },
    { name: "usb", value: "usb" },
    { name: "cw", value: "cw" },
    { name: "sam", value: "sam" },
    { name: "dmr", value: "dmr" },
    { name: "dstar", value: "dstar" },
    { name: "nxdn", value: "nxdn" },
    { name: "ysf", value: "ysf" },
    { name: "m17", value: "m17" },
    { name: "freedv", value: "freedv" },
    { name: "drm", value: "drm" },
    { name: "dab", value: "dab" },
    { name: "bpsk31", value: "bpsk31" },
    { name: "bpsk63", value: "bpsk63" },
    { name: "rtty170", value: "rtty170" },
    { name: "rtty450", value: "rtty450" },
    { name: "rtty85", value: "rtty85" },
    { name: "sitorb", value: "sitorb" },
    { name: "ft8", value: "ft8" },
    { name: "ft4", value: "ft4" },
    { name: "jt65", value: "jt65" },
    { name: "jt9", value: "jt9" },
    { name: "wspr", value: "wspr" },
    { name: "fst4", value: "fst4" },
    { name: "fst4w", value: "fst4w" },
    { name: "msk144", value: "msk144" },
    { name: "js8", value: "js8" },
    { name: "packet", value: "packet" },
    { name: "ais", value: "ais" },
    { name: "page", value: "page" },
    { name: "cwdecoder", value: "cwdecoder" },
    { name: "sstv", value: "sstv" },
    { name: "fax", value: "fax" },
    { name: "selcall", value: "selcall" },
    { name: "zvei", value: "zvei" },
    { name: "ism", value: "ism" },
    { name: "hfdl", value: "hfdl" },
    { name: "vdl2", value: "vdl2" },
    { name: "acars", value: "acars" },
    { name: "adsb", value: "adsb" },
];

const sampRateDefault = 4
const sampRateOptions = [
    { name: '1.0 MS/s', value: 1.0 },
    { name: '1.4 MS/s', value: 1.4 },
    { name: '1.8 MS/s', value: 1.8 },
    { name: '2.048 MS/s', value: 2.048 },
    { name: '2.4 MS/s (recommended for RTL-SDR)', value: 2.4 },
    { name: '2.56 MS/s', value: 2.56 },
    { name: '2.8 MS/s', value: 2.8 },
    { name: '3.2 MS/s', value: 3.2 },
]

let profileData = {};

const generateProfile = async () => {
    console.log('Welcome to the Profile Generator!');
    console.log('This tool will help you generate configuration profiles.');

    const confirmation = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'readyToStart',
            message: 'Are you ready to generate profiles?',
            default: true,
        }
    ]);

    if (!confirmation.readyToStart) {
        console.log('Profile generation canceled.');
        return;
    }

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'startFreq',
            message: 'Enter the start frequency in MHz (e.g., 400):',
            validate: value => {
                const parsed = parseFloat(value);
                return !isNaN(parsed) && parsed > 0 ? true : 'Please enter a positive number.';
            },
            filter: Number,
        },
        {
            type: 'input',
            name: 'endFreq',
            message: 'Enter the end frequency in MHz (e.g., 460):',
            validate: (value, answers) => {
                const parsed = parseFloat(value);
                if (isNaN(parsed) || parsed <= 0) {
                    return 'Please enter a positive number.';
                }
                if (parsed <= answers.startFreq) {
                    return 'End frequency must be greater than start frequency.';
                }
                return true;
            },
            filter: Number,
        },
        {
            type: 'input',
            name: 'prefixName',
            message: 'Insert the text BEFORE the profile name:',
            default: ''
        },
        {
            type: 'input',
            name: 'suffixName',
            message: 'Insert the text AFTER the profile name:',
            default: ''
        },
        {
            type: 'list',
            name: 'sampRate',
            message: 'Select the sample rate (MS/s):',
            choices: sampRateOptions,
            default: sampRateDefault
        },
        {
            type: 'list',
            name: 'startMod',
            message: 'Select the modulation type:',
            choices: modOptions,
            default: modDefault,
        },
        {
            type: 'list',
            name: 'tuningStep',
            message: 'Select the tuning step in Hz:',
            choices: tuningStepOptions,
            default: tuningStepDefault,
        },
    ]);

    const prefixName = answers.prefixName ? `${answers.prefixName} ` : ""
    const postfixName = answers.postfixName ? ` ${answers.postfixName}` : ""

    for (let i = answers.startFreq; i <= answers.endFreq; i += 2) {
        const profileKey = uuidv4();
        profileData[profileKey] = {
            name: `${prefixName}${i}-${i + 2}${postfixName}`,
            center_freq: (i + 1) * 1000000,
            samp_rate: answers.sampRate * 1000000,
            start_freq: i * 1000000,
            start_mod: answers.startMod,
            tuning_step: answers.tuningStep,
        };
    }

    writeFile('profiles.json', JSON.stringify(profileData, null, 2), (err) => {
        if (err) {
            console.error(`Error writing file: ${err}`);
        } else {

            // Вместо exec('code profiles.json', ...)
            console.log('The file profiles.json has been successfully created! Opening it...');

            open('profiles.json').catch(error => {
                console.error(`Failed to open profiles.json: ${error}`);
            });
        }
    });
};

generateProfile();
