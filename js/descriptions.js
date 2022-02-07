const { $CombinedState } = require("redux");

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const writtenTweets = [];
	let tweetNum = 1;
	tweet_array.forEach(tweet => {
		if (tweet.written()) {
			writtenTweets.push({num: tweetNum, activity: tweet.activityType(),
							text: tweet.writtenText()});
			tweetNum++;
		}
	});

}

function addEventHandlerForSearch() {
	$("#searchText").text($("#textFilter").val());
	let searchText = $("#searchText").text();

	const filteredTweets = [];
	if (searchText !== "") {
		filteredTweets = writtenTweets.filter(tweet => {
			if (tweet.writtenText().includes(searchText)) {
				return tweet;
			}
		});
	}

	// update searchCount and searchText spans
	$("#searchCount").text(filteredTweets.length);
	$("#searchText").text(searchText.length);

	// populating table; not clickable
	let tweetTable = $("#tweetTable");
	tweetTable.empty();
	if (searchText === "") {
		tweetTable.empty();
	} else {
		filteredTweets.forEach(tweet => {
			let rowHTML = "<tr>";
			rowHTML += "<td>" + tweet.num + "</td>\n<td>" + tweet.activity + 
				"</td>\n<td>" + tweet.text + "</td>";
			rowHTML += "/n</tr>";
			tweetTable.append(rowHTML);
		});
	}



}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});