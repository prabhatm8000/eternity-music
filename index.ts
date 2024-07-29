import fs from "fs";
import InnerTube from "./innertube/InnerTube";

const innertube = new InnerTube();

innertube
    .search({
        type: "SEARCH_TYPE_SONG",
        query: "say so",
        // continuation:
        // "ErIDEg1oYW5nb3ZlciBraWNrGqADRWdXS0FRSUlBVWdVYWhBUUF4QUVFQVVRQ1JBS0VCRVFFQkFWZ2dFTE5XeExkamRyWkhwQ1duT0NBUXR1Y0VabE5XVkZTV0l5YTRJQkMwRk1Obll5TmtKTGFHUk5nZ0VMWDNoeFNGZE9ZVmRZZUhlQ0FRdDNlREppUkV4amNETm5SWUlCQzA5eWRGVmtXVUppZVVOM2dnRUxZVUZPY25OVlJGRTNVM2VDQVFzMWVXUnVRbU5yYTE5NVRZSUJDMjl1VkdVNVQxUkdZMVpWZ2dFTFVIazRkbWx4YlhkM2JWbUNBUXRpZEVwT2VYZDZVVmRIUVlJQkMzSnVUeTFOWm14WmVFTjNnZ0VMVGsxQlgybHpXbGx6V1ZHQ0FRdFhSMVY2U2xSMWMySlhkNElCQzFsTFdWQndOMUZKT0ZKcmdnRUxSMUoyWVhsMU56VkRSVTJDQVF0WWREUTRTVVJFZFc1Mk1JSUJDMDVhTkRoQ2NFSnhhWEpGZ2dFTGFHWklUVU5uUVZBM1oydUNBUXRqYkRoUmQyTnhWR00yU1ElM0QlM0QY8erQLg%3D%3D",
    })
    .then((data) => {
        const jsonData = JSON.stringify(data);

        fs.writeFileSync("./testingData/song.json", jsonData);
    });

// innertube
//     .search({
//         type: "SEARCH_TYPE_VIDEO",
//         query: "say so",
//         // continuation:
//         // "ErIDEg1oYW5nb3ZlciBraWNrGqADRWdXS0FRSUlBVWdVYWhBUUF4QUVFQVVRQ1JBS0VCRVFFQkFWZ2dFTE5XeExkamRyWkhwQ1duT0NBUXR1Y0VabE5XVkZTV0l5YTRJQkMwRk1Obll5TmtKTGFHUk5nZ0VMWDNoeFNGZE9ZVmRZZUhlQ0FRdDNlREppUkV4amNETm5SWUlCQzA5eWRGVmtXVUppZVVOM2dnRUxZVUZPY25OVlJGRTNVM2VDQVFzMWVXUnVRbU5yYTE5NVRZSUJDMjl1VkdVNVQxUkdZMVpWZ2dFTFVIazRkbWx4YlhkM2JWbUNBUXRpZEVwT2VYZDZVVmRIUVlJQkMzSnVUeTFOWm14WmVFTjNnZ0VMVGsxQlgybHpXbGx6V1ZHQ0FRdFhSMVY2U2xSMWMySlhkNElCQzFsTFdWQndOMUZKT0ZKcmdnRUxSMUoyWVhsMU56VkRSVTJDQVF0WWREUTRTVVJFZFc1Mk1JSUJDMDVhTkRoQ2NFSnhhWEpGZ2dFTGFHWklUVU5uUVZBM1oydUNBUXRqYkRoUmQyTnhWR00yU1ElM0QlM0QY8erQLg%3D%3D",
//     })
//     .then((data) => {
//         const jsonData = JSON.stringify(data);

//         fs.writeFileSync("./testingData/video.json", jsonData);
//     });

// innertube
//     .search({
//         type: "SEARCH_TYPE_ARTIST",
//         query: "say so doja cat",
//         // continuation:
//         // "ErIDEg1oYW5nb3ZlciBraWNrGqADRWdXS0FRSUlBVWdVYWhBUUF4QUVFQVVRQ1JBS0VCRVFFQkFWZ2dFTE5XeExkamRyWkhwQ1duT0NBUXR1Y0VabE5XVkZTV0l5YTRJQkMwRk1Obll5TmtKTGFHUk5nZ0VMWDNoeFNGZE9ZVmRZZUhlQ0FRdDNlREppUkV4amNETm5SWUlCQzA5eWRGVmtXVUppZVVOM2dnRUxZVUZPY25OVlJGRTNVM2VDQVFzMWVXUnVRbU5yYTE5NVRZSUJDMjl1VkdVNVQxUkdZMVpWZ2dFTFVIazRkbWx4YlhkM2JWbUNBUXRpZEVwT2VYZDZVVmRIUVlJQkMzSnVUeTFOWm14WmVFTjNnZ0VMVGsxQlgybHpXbGx6V1ZHQ0FRdFhSMVY2U2xSMWMySlhkNElCQzFsTFdWQndOMUZKT0ZKcmdnRUxSMUoyWVhsMU56VkRSVTJDQVF0WWREUTRTVVJFZFc1Mk1JSUJDMDVhTkRoQ2NFSnhhWEpGZ2dFTGFHWklUVU5uUVZBM1oydUNBUXRqYkRoUmQyTnhWR00yU1ElM0QlM0QY8erQLg%3D%3D",
//     })
//     .then((data) => {
//         const jsonData = JSON.stringify(data);

//         fs.writeFileSync("./testingData/artist.json", jsonData);
//     });

// innertube
//     .search({
//         type: "SEARCH_TYPE_ALBUM",
//         query: "say so",
//         // continuation:
//         // "ErIDEg1oYW5nb3ZlciBraWNrGqADRWdXS0FRSUlBVWdVYWhBUUF4QUVFQVVRQ1JBS0VCRVFFQkFWZ2dFTE5XeExkamRyWkhwQ1duT0NBUXR1Y0VabE5XVkZTV0l5YTRJQkMwRk1Obll5TmtKTGFHUk5nZ0VMWDNoeFNGZE9ZVmRZZUhlQ0FRdDNlREppUkV4amNETm5SWUlCQzA5eWRGVmtXVUppZVVOM2dnRUxZVUZPY25OVlJGRTNVM2VDQVFzMWVXUnVRbU5yYTE5NVRZSUJDMjl1VkdVNVQxUkdZMVpWZ2dFTFVIazRkbWx4YlhkM2JWbUNBUXRpZEVwT2VYZDZVVmRIUVlJQkMzSnVUeTFOWm14WmVFTjNnZ0VMVGsxQlgybHpXbGx6V1ZHQ0FRdFhSMVY2U2xSMWMySlhkNElCQzFsTFdWQndOMUZKT0ZKcmdnRUxSMUoyWVhsMU56VkRSVTJDQVF0WWREUTRTVVJFZFc1Mk1JSUJDMDVhTkRoQ2NFSnhhWEpGZ2dFTGFHWklUVU5uUVZBM1oydUNBUXRqYkRoUmQyTnhWR00yU1ElM0QlM0QY8erQLg%3D%3D",
//     })
//     .then((data) => {
//         const jsonData = JSON.stringify(data);

//         fs.writeFileSync("./testingData/album.json", jsonData);
//     });
