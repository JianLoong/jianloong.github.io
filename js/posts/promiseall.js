/*
 * The Promise.all demo.
 *
 * The 2019 post never actually ran: its script was commented out and the reader
 * was told to paste the code into a browser console, which is what the three
 * figures show. This runs it on the page instead, against the same end points —
 * the Hacker News Firebase API, which is open and CORS-permissive — and puts
 * Promise.all next to the same work done one request at a time, because the
 * difference is the whole point of the method.
 */
(function () {
  var demo = document.querySelector("[data-promiseall]");
  if (!demo) return;

  var size = demo.querySelector("[data-promiseall-size]");
  var concurrentButton = demo.querySelector("[data-promiseall-concurrent]");
  var sequentialButton = demo.querySelector("[data-promiseall-sequential]");
  var readout = demo.querySelector("[data-promiseall-readout]");
  var rows = demo.querySelector("[data-promiseall-rows]");

  var TOP = "https://hacker-news.firebaseio.com/v0/topstories.json";
  var ITEM = "https://hacker-news.firebaseio.com/v0/item/";

  function getJSON(url) {
    return fetch(url, { mode: "cors" }).then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    });
  }

  function elapsed(started) {
    return Math.round(performance.now() - started);
  }

  function busy(state) {
    concurrentButton.disabled = state;
    sequentialButton.disabled = state;
    size.disabled = state;
  }

  function draw(stories) {
    rows.innerHTML = "";

    stories.forEach(function (story, index) {
      if (!story) return;

      var row = document.createElement("tr");

      [String(index + 1), String(story.score === undefined ? "—" : story.score), story.by || "—"].forEach(
        function (value) {
          var cell = document.createElement("td");
          cell.textContent = value;
          row.appendChild(cell);
        }
      );

      var titleCell = document.createElement("td");
      titleCell.className = "phrase";
      titleCell.textContent = story.title || "(no title)";
      row.appendChild(titleCell);

      rows.appendChild(row);
    });
  }

  function report(mode, stories, milliseconds, count) {
    readout.textContent =
      mode +
      ": " +
      stories.length +
      " stories from " +
      count +
      " requests in " +
      milliseconds +
      " ms" +
      (mode === "Promise.all"
        ? " — all requests in flight at once."
        : " — one request at a time.");
  }

  // Promise.all: build every request first, then wait for all of them together.
  function runConcurrent() {
    var count = Number(size.value);
    busy(true);
    readout.textContent = "Fetching " + count + " stories with Promise.all…";

    var started = performance.now();

    getJSON(TOP)
      .then(function (ids) {
        var wanted = ids.slice(0, count);
        return Promise.all(
          wanted.map(function (id) {
            return getJSON(ITEM + id + ".json");
          })
        );
      })
      .then(function (stories) {
        draw(stories);
        report("Promise.all", stories, elapsed(started), count + 1);
        busy(false);
      })
      .catch(function (error) {
        readout.textContent = "The API did not answer (" + error.message + "). It is a third party and it does go down.";
        busy(false);
      });
  }

  // The same work, awaited one at a time. Slower, and the point of the post.
  async function runSequential() {
    var count = Number(size.value);
    busy(true);
    readout.textContent = "Fetching " + count + " stories one at a time…";

    var started = performance.now();

    try {
      var ids = await getJSON(TOP);
      var stories = [];

      for (var i = 0; i < count; i++) {
        stories.push(await getJSON(ITEM + ids[i] + ".json"));
      }

      draw(stories);
      report("One at a time", stories, elapsed(started), count + 1);
    } catch (error) {
      readout.textContent = "The API did not answer (" + error.message + ").";
    }

    busy(false);
  }

  concurrentButton.addEventListener("click", runConcurrent);
  sequentialButton.addEventListener("click", runSequential);

  readout.textContent = "Press a button: the same requests, batched and serialised.";
})();
