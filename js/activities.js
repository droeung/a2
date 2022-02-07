function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	let activityTypes = new Object();
	activityTypes["running"] = {count: 0, totalDist: 0};
	activityTypes["walking"] = {count: 0, totalDist: 0};
	activityTypes["hiking"] = {count: 0, totalDist: 0};

	tweet_array.forEach(tweet => {
		if (tweet.activityType() === "running") {
			activityTypes["running"].count += 1;
			activityTypes["running"].totalDist += tweet.distance();
		} else if (tweet.activityType() === "walking") {
			activityTypes["walking"].count += 1;
			activityTypes["walking"].totalDist += tweet.distance();
		} else if (tweet.activityType() === "hiking") {
			activityTypes["hiking"].count += 1;
			activityTypes["hiking"].totalDist += tweet.distance();
		}
	});

	const activityTypeArray = [];
	for (let key in activityTypes) {
		activityTypeArray.push({activity: key, count: activityTypes[key].count,
							distance: activityTypes[key].totalDist});
	}

	// Graph 1
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
		"values": activityTypeArray
		},
		"mark": "point",
		"encoding": {
			"x": {"field": "activity", "type": "ordinal"},
			"y": {"field": "count", "type": "quantitative"},
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	const dayOfWeekArray = [];
	tweet_array.forEach(tweet => {
		dayOfWeekArray.push({activity: tweet.activityType(), day: tweet.day(),
						distance: tweet.distance()});
	});

	// Graph 2
	day_of_week_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the three most-tweeted activities by day of the week.",
	  "data": {
		"values": dayOfWeekArray
		},
		"mark": "point",
		"encoding": {
			"x": {"field": "day", "type": "ordinal",
				"sort": ["Sun", "M", "Tu", "W", "Th", "F", "Sat"]},
			"y": {"field": "distance", "type": "quantitative"}
		}
	};
	vegaEmbed('#dayOfWeekVis', day_of_week_vis_spec, {actions:false});
	
	// Graph 3
	aggregated_vis = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the three most tweeted activities by day, aggregated by mean.",
	  "data": {
		"values": dayOfWeekArray
		},
		"mark": "point",
		"encoding": {
			"x": {"field": "day", "type": "ordinal",
				"sort": ["Sun", "M", "Tu", "W", "Th", "F", "Sat"]},
			"y": {"field": "distance", "aggregate": "average", "type": "quantitative"}
		}
	};
	vegaEmbed('#aggregatedVis', aggregated_vis, {actions:false});

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});