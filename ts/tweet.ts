class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.includes("completed") || this.text.includes("posted")) {
            return "completed_event";
        } else if (this.text.toLowerCase().includes("right now")) {
            return "live_event";
        } else if (this.text.toLowerCase().includes("achieved") || this.text.includes("set a goal")) {
            return "achievement";
        } else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (this.text.includes("Check it out!") || this.text.includes("#FitnessAlerts")) {
            return false;
        }
        return true;
    }

    get writtenText():string {
        if (!this.written) {
            return "";
        } else if (this.text.includes(" - ")) {
            return this.text.substring(this.text.indexOf(" - "), this.text.indexOf("https"));
        } else {
            this.text.replace("#Runkeeper", "");
            this.text.replace(/https:\/\/t\.co\/[\S]+\s/gm, "");
            return this.text;
        }
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        } else {
            if (this.text.includes("run")) {
                return "running";
            } else if (this.text.includes("walk")) {
                return "walking";
            } else if (this.text.includes("hike")) {
                return "hiking";
            }
        }
        return "unknown";
    }

    get distance():number {
        if (this.source != 'completed_event') {
            return 0;
        } else {
            if (this.activityType !== "unknown") {
                let ind:number = this.text.search(/\d+\.\d+\smi/gm); // searches miles
                if (ind !== -1) {
                    let dist:string = this.text.substring(ind, ind+5);
                    return +dist.trim();
                }
                ind = this.text.search(/\d+\.\d+\skm/gm); // try km, if miles not found
                if (ind !== -1) {
                    let temp:string = this.text.substring(ind, ind+5);
                    let dist:number = +temp.trim();
                    return +(dist/1.609).toFixed(2);
                }
            }
        }
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}