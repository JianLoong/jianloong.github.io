---
title: "Reddit Data Analysis: Visualizing r/AmItheAsshole Community Judgments"
author: Jian Liew
pubDatetime: 2019-10-09T20:56:02+11:00
slug: reddit-amitheasshole-data-visualization
featured: false
draft: false
readingTime: 6
tags:
  - data-visualization
  - tools
description: "A real-time data visualization project analyzing community judgments from the r/AmItheAsshole subreddit using Reddit's JSON API and interactive charts."

---

## Introduction

A new and improved version of this can be found at [here](https://pangrammer.dev/aita)

This project explores the fascinating world of community-driven moral judgments through data visualization. By analyzing posts from the popular r/AmItheAsshole subreddit, we can gain insights into how online communities collectively evaluate interpersonal conflicts and ethical dilemmas.

## About r/AmItheAsshole

The r/AmItheAsshole subreddit serves as a unique platform for moral philosophy in action. As described by the community:

> *A catharsis for the frustrated moral philosopher in all of us, and a place to finally find out if you were wrong in an argument that's been bothering you. Tell us about any non-violent conflict you have experienced; give us both sides of the story, and find out if you're right, or you're the asshole.*

The subreddit can be found at [https://www.reddit.com/r/AmItheAsshole/](https://www.reddit.com/r/AmItheAsshole/)

## Understanding the Voting System

The community uses a standardized voting system with specific abbreviations:

| Abbreviation | Meaning             | Description |
| ------------ | ------------------- | ----------- |
| YTA          | You're the A-hole   | The poster is in the wrong |
| NTA          | Not the A-hole      | The poster is not in the wrong |
| ESH          | Everyone sucks here | Both parties are at fault |
| NAH          | No A-holes here     | No one is at fault |
| INFO         | Not Enough Info     | More information needed |


## Live Data Visualization

The charts below represent real-time analysis of current r/AmItheAsshole posts. Each chart shows the distribution of community judgments for individual posts.

<div class="result">
</div>

## Technical Deep Dive

This uses jQuery components and to be fair should be avoided in 2025.

### Data Processing Pipeline

```javascript
// 1. Fetch posts from subreddit
let getPost = () => {
    let endPoint = "https://reddit.com/r/amitheasshole.json?limit=50&jsonp=?"
    $.getJSON(endPoint, function(data){
        let entries = data["data"].children;
        for(let i = 0; i < entries.length; i++){
            let link = entries[i]["data"]["permalink"];
            parseResult(link);
        }
    });
}

// 2. Analyze individual post comments
let parseResult = (link) => {
    const endPoint = "https://reddit.com" + link + ".json?limit=80&jsonp=?";
    
    $.getJSON(endPoint, function(data){
        let title = data[0].data.children[0].data["title"];
        let replies = data[1]["data"].children;
        
        // Count judgment patterns in comments
        let countNTAAppearance = 0;
        let countYTAAppearance = 0;
        let countESHAppearance = 0;
        let countNAHAppearance = 0;
        let countINFOAppearance = 0;
        
        for (let i = 0; i < replies.length; i++) {
            let reply = replies[i]["data"].body;
            if (reply == undefined) continue;
            
            countNTAAppearance += (reply.match(/NTA/g) || []).length;
            countYTAAppearance += (reply.match(/YTA/g) || []).length;
            countESHAppearance += (reply.match(/ESH/g) || []).length;
            countNAHAppearance += (reply.match(/NAH/g) || []).length;
            countINFOAppearance += (reply.match(/INFO/g) || []).length;
        }
        
        // Create result object and visualize
        let jsonResult = {
            "id": data[0].data.children[0].data["id"],
            "url": "https://reddit.com" + link,
            "title": title,
            "countNTAAppearance": countNTAAppearance,
            "countYTAAppearance": countYTAAppearance,
            "countESHAppearance": countESHAppearance,
            "countNAHAppearance": countNAHAppearance,
            "countINFOAppearance": countINFOAppearance,
        }
        
        summary.push(jsonResult);
        showResult(jsonResult);
    });
}
```

### Visualization Implementation

```javascript
let showResult = (jsonResult) => {
    // Create chart container
    let output = "<strong>" + jsonResult["title"] + "</strong>";    
    let out = output + "<p><a id=" + jsonResult["id"] + "_link> Click here</a> to view post in context.</p>";

    $(".result").append("<div class='shadow'>" + out + "<div class='' id=" + jsonResult["id"] + "></div></div>");
    $("#" + jsonResult["id"] + "_link").prop("href", jsonResult["url"]);

    // Configure chart data
    const data = {
        labels: ["NTA","YTA","ESH","NAH","INFO"],
        datasets: [{
            name: "data",
            charType: 'percentage',
            values: [
                jsonResult["countNTAAppearance"], 
                jsonResult["countYTAAppearance"], 
                jsonResult["countESHAppearance"],
                jsonResult["countNAHAppearance"],
                jsonResult["countINFOAppearance"],
            ]
        }]
    }

    // Render interactive chart
    const chart = new frappe.Chart(document.getElementById(jsonResult["id"]), {
        data: data,
        type: 'percentage',
        colors: ['#33691e', '#b71c1c', '#f47e17','#1a237e','#e8eaf6']
    });
}
```

## Data Analysis Insights

### Community Behavior Patterns

The visualization reveals several interesting patterns:

1. **Judgment Distribution**: Shows how the community collectively evaluates different types of conflicts
2. **Consensus Levels**: Indicates how strongly the community agrees or disagrees on specific issues
3. **Information Needs**: Highlights cases where the community needs more context to make judgments

### Technical Challenges

- **Rate Limiting**: Reddit's API has rate limits that affect data collection
- **Data Consistency**: Comment structure can vary, requiring robust parsing
- **Real-time Updates**: Keeping visualizations current with live data

## Ethical Considerations

### Data Privacy
- Only public Reddit data is analyzed
- No personal information is collected or stored
- Respects Reddit's terms of service

### Community Impact
- Analysis helps understand community dynamics
- Provides insights into collective moral reasoning
- Supports transparency in community decision-making



## Conclusion

This project demonstrates the power of combining web APIs, data analysis, and visualization to gain insights into online community behavior. The r/AmItheAsshole subreddit provides a unique dataset for understanding how people collectively evaluate moral dilemmas.

### Key Takeaways
- **Community Intelligence**: Online communities can provide valuable collective insights
- **Data Visualization**: Interactive charts make complex data accessible
- **Real-time Analysis**: Live data provides current and relevant insights
- **Technical Integration**: Combining multiple technologies creates powerful tools

---

*This visualization represents a snapshot of community judgment patterns, providing insights into how we collectively evaluate moral conflicts in the digital age.*
