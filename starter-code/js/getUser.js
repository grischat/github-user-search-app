"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("button");

  button.addEventListener("click", (event) => {
    event.preventDefault();
    searchGitHubUser();
  });

  const input = document.getElementById("input");

  
  input.addEventListener("keyup", (event) => {
  
    if (event.keyCode === 13) {
      event.preventDefault();
      searchGitHubUser();
    }
  });

  async function searchGitHubUser() {
    const user = input.value;
    const avatar = document.getElementById("user__avatar");
    const name = document.getElementById("user__name");
    const userLink = document.getElementById("user__link");
    const userJoined = document.getElementById("user__joined");
    const userBio = document.getElementById("user__bio");
    const userRepos = document.getElementById("repos");
    const userFollowers = document.getElementById("followers");
    const userFollowing = document.getElementById("following");
    const location = document.getElementById("location");
    const linkRepos = document.getElementById("link__repos");
    const linkTwitter = document.getElementById("link__twitter");
    const twitterStatus = document.getElementById("twitter__status");
    const linkCompany = document.getElementById("company");
    const companyStatus = document.getElementById("company__name");
    const searchContainer = document.querySelector(".search__container");

    const usersListUrl = `https://api.github.com/users/${user}`;

    async function sendRequest(method, url) {
      try {
        const response = await fetch(url);
        console.log(response);
        if (response.status === 404) {
          // User not found
          const existingValidationMsg =
            searchContainer.querySelector("#validation");
          if (existingValidationMsg) {
            // If element exists - delete element
            existingValidationMsg.remove();
          }

          const validationMsg = document.createElement("p");
          validationMsg.textContent = "No results";
          validationMsg.id = "validation";
          searchContainer.insertBefore(validationMsg, button); // Adding <p> element with validation

          return null;
        } else {
          const existingValidationMsg =
            searchContainer.querySelector("#validation");
          if (existingValidationMsg) {
            existingValidationMsg.remove(); // deleting <p> element with validation
          }
        }

        const data = await response.json(); // Data parsing

        avatar.src = data.avatar_url; // update a user`s avatar
        name.innerText = data.login; // update a user`s header name
        userLink.href = data.html_url;
        userLink.textContent = `@${data.login}`; // update a user`s github url and @
        if (data.bio != null) {
          userBio.innerText = data.bio;
          userBio.style.opacity = "1";
        } else {
          userBio.innerText = `This profile has no bio`;
          userBio.style.opacity = "0.3";
        }

        //Here we need to parse ISO 8601 dates from created_at property into our string 'Joined {day-int}{month-string}{year-int}
        const newDate = new Date(data.created_at);

        // Month modifier int to string
        function monthString(number) {
          const monthArr = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          return monthArr[number];
        }
        const formattedDate = `Joined ${newDate.getDate()} ${monthString(
          newDate.getMonth()
        )} ${newDate.getFullYear()}`;
        userJoined.textContent = formattedDate;

        //Secondary data (repos,followers,following)
        userRepos.innerText = data.public_repos;
        userFollowers.innerText = data.followers;
        userFollowing.innerText = data.following;

        //Links data
        if (data.location != null) {
          location.innerText = data.location; // location link
          location.style.opacity = "1";
        } else {
          location.innerText = "Not found";
          location.style.opacity = "0.3";
        }

        linkRepos.href = `https://github.com/${user}?tab=repositories`; // repositories link

        if (data.twitter_username != null) {
          // twitter link
          linkTwitter.href = `https://twitter.com/${data.twitter_username}`;
          linkTwitter.removeAttribute("disabled");
          twitterStatus.innerText = "Twitter";
          twitterStatus.style.opacity = "1";
        } else {
          linkTwitter.removeAttribute("href");
          linkTwitter.setAttribute("disabled", "disabled");
          twitterStatus.innerText = "Not found";
          twitterStatus.style.opacity = "0.3";
        }

        if (data.company != null) {
          const companyName = data.company;
          const companyLink = companyName.replace("@", "");
          linkCompany.href = `https://github.com/${companyLink}`;

          companyStatus.innerText = data.company;
          companyStatus.style.opacity = "1";
        } else {
          linkCompany.removeAttribute("href");
          linkCompany.setAttribute("disabled", "disabled");
          companyStatus.innerText = "Not found";
          companyStatus.style.opacity = "0.3";
        }

        return data;
      } catch (error) {
        console.error(error);
      }
    }

    (async () => {
      try {
        const data = await sendRequest("GET", usersListUrl);
        console.log(data); //List of user`s properties in console
      } catch (error) {
        console.error(error);
      }
    })();
  }
});
