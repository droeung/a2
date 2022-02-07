"use strict";
class Tweet {
    constructor(tweet_text, tweet_time) {
        this.text = tweet_text;
        this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
    }
    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source() {
        if (this.text.toLowerCase().includes("completed") || this.text.toLowerCase().includes("posted")) {
            return "completed_event";
        }
        else if (this.text.toLowerCase().includes("now")) {
            return "live_event";
        }
        else if (this.text.toLowerCase().includes("achieved")) {
            return "achievement";
        }
        else {
            return "miscellaneous";
        }
    }
    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written() {
        if (this.text.includes("Check it out!") || this.text.includes("#FitnessAlerts")) {
            return false;
        }
        return true;
    }
    get writtenText() {
        if (!this.written) {
            return "";
        }
        else {
            this.text.replace("#Runkeeper", "");
            this.text.replace(/https:\/\/t\.co\/[\S]+\s/gm, "");
            return this.text;
        }
    }
    get activityType() {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        else {
            if (this.text.includes("run")) {
                return "running";
            }
            else if (this.text.includes("walk")) {
                return "walking";
            }
            else if (this.text.includes("hike")) {
                return "hiking";
            }
        }
        return "unknown";
    }
    get distance() {
        if (this.source != 'completed_event') {
            return 0;
        }
        else {
            if (this.activityType !== "unknown") {
                let ind = this.text.search(/\d+\.\d+\smi/gm); // searches miles
                if (ind !== -1) {
                    let dist = this.text.substring(ind, ind + 5);
                    return +dist.trim();
                }
                ind = this.text.search(/\d+\.\d+\skm/gm); // try km, if miles not found
                if (ind !== -1) {
                    let temp = this.text.substring(ind, ind + 5);
                    let dist = +temp.trim();
                    return dist / 1.609;
                }
            }
        }
        return 0;
    }
    getHTMLTableRow(rowNumber) {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}
