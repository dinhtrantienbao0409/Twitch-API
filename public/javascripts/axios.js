const fetchChannels = async (type) => {
  try {
    const channels = [
      "ESL_SC2",
      "OgamingSC2",
      "cretetion",
      "freecodecamp",
      "storbeck",
      "habathcx",
      "RobotCaleb",
      "noobs2ninjas",
    ];
    let dataset = [];

    const promises = channels.map(async (channel) => {
      const { data } = await axios.get(
        `https://twitch-proxy.freecodecamp.rocks/twitch-api/${type}/${channel}`
      );
      return data;
    });

    dataset = await Promise.all(promises);
    return dataset;
  } catch (error) {
    console.log(
      "🚀 ~ file: axios.js ~ line 16 ~ fetchAllStreamers ~ error",
      error
    );
  }
};

const renderOnlineChannels = (streamers, onlineChannels) => {
  onlineChannels.forEach((item) => {
    if (item.stream == null) {
      return;
    }

    // Render streamer list
    const streamerItem = document.createElement("li");
    streamerItem.classList.add("online");

    // Render streamer's logo
    const imgEle = document.createElement("img"); // src
    imgEle.src = item.stream.channel.logo;

    // Render streamer's link
    const linkEle = document.createElement("a"); // href
    linkEle.innerHTML = item.stream.channel.display_name;
    linkEle.href = item.stream.channel.url;

    // Render streamer's status
    const statusEle = document.createElement("span");
    statusEle.innerHTML = `${item.stream.game}: ${item.stream.channel.status}`;

    streamerItem.appendChild(imgEle);
    streamerItem.appendChild(linkEle);
    streamerItem.appendChild(statusEle);

    streamers.appendChild(streamerItem);
  });
};

const renderOfflineChannels = (streamers, offlineChannels) => {
  offlineChannels.forEach((item) => {
    // Render streamer list
    const streamerItem = document.createElement("li");
    streamerItem.classList.add("offline");

    // Render streamer's logo
    const imgEle = document.createElement("img"); // src
    imgEle.src = item.logo;

    // Render streamer's link
    const linkEle = document.createElement("a"); // href
    linkEle.innerHTML = item.display_name;
    linkEle.href = item.url;

    // Render streamer's status
    const statusEle = document.createElement("span");
    statusEle.innerHTML = `Offline`;

    streamerItem.appendChild(imgEle);
    streamerItem.appendChild(linkEle);
    streamerItem.appendChild(statusEle);

    streamers.appendChild(streamerItem);
  });
};

const renderAllChannels = (onlineChannels, offlineChannels) => {
  const streamers = document.querySelector("#streamers");
  renderOnlineChannels(streamers, onlineChannels);
  renderOfflineChannels(streamers, offlineChannels);
};

// BOM
window.addEventListener("load", async () => {
  // Fetch all channels
  const channels = await fetchChannels("channels");

  // Fetch online channels
  // HOF higher order function (map, filter, reduce, foreach || some, every, find, ... )
  const onlineChannels = await (
    await fetchChannels("streams")
  ).filter((channel) => channel.stream !== null);

  // Get online channels's name
  const onlineChannelsName = onlineChannels.map(
    (item) => item.stream.channel.display_name
  );
  console.log(
    "🚀 ~ file: axios.js ~ line 25 ~ window.addEventListener ~ onlineChannelsName",
    onlineChannelsName
  );

  // Get offline channels
  const offlineChannels = channels.filter(
    (channel) => !onlineChannelsName.includes(channel.display_name)
  );

  console.log(
    "🚀 ~ file: axios.js ~ line 30 ~ offlineChannels ~ offlineChannels",
    offlineChannels
  );
  console.log(
    "🚀 ~ file: axios.js ~ line 24 ~ window.addEventListener ~ onlineChannels",
    onlineChannels
  );
  console.log(
    "🚀 ~ file: axios.js ~ line 23 ~ window.addEventListener ~ streamers",
    channels
  );

  const allTab = document.querySelector("#nav-all-tab");
  const onlineTab = document.querySelector("#nav-online-tab");
  const offlineTab = document.querySelector("#nav-offline-tab");

  // Init all channels data
  renderAllChannels(onlineChannels, offlineChannels);

  allTab.addEventListener("click", (event) => {
    const streamers = document.querySelector("#streamers");
    while (streamers.firstChild) {
      streamers.removeChild(streamers.lastChild);
    }
    renderAllChannels(onlineChannels, offlineChannels);
  });

  onlineTab.addEventListener("click", (event) => {
    const onlineStreamers = document.querySelector("#onlineStreamers");
    while (onlineStreamers.firstChild) {
      onlineStreamers.removeChild(onlineStreamers.lastChild);
    }
    renderOnlineChannels(onlineStreamers, onlineChannels);
  });

  offlineTab.addEventListener("click", (event) => {
    const offlineStreamers = document.querySelector("#offlineStreamers");

    while (offlineStreamers.firstChild) {
      offlineStreamers.removeChild(offlineStreamers.lastChild);
    }

    renderOfflineChannels(offlineStreamers, offlineChannels);
  });
});
