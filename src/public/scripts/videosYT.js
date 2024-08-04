function getChannelVideos() {
    const channelId = 'UCNZfTguBWcPVx0-fhol6Cog'; // ID de tu canal
    const maxResults = 10; // Número máximo de videos que deseas obtener
    const apiKey = 'AIzaSyAhR5VaN1LUeeqImVmSmAEFupPkr_Ur9UA'; // Tu clave de API de YouTube
  
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=date&channelId=${channelId}&maxResults=${maxResults}&key=${apiKey}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('La solicitud no se pudo completar');
              }
              return response.json();
          })
          .then(data => {
              const videos = data.items;
              const videoContainer = document.getElementById('videos-container');
  
              videos.forEach(video => {
                  const videoWrapper = document.createElement('div');
                  videoWrapper.classList.add('video-wrapper');
  
                  const videoTitle = document.createElement('h4');
                  videoTitle.textContent = video.snippet.title;
  
                  const iframe = document.createElement('iframe');
                  iframe.width = '560';
                  iframe.height = '315';
                  iframe.src = `https://www.youtube.com/embed/${video.id.videoId}`;
                  iframe.allowFullscreen = true;
  
                  videoWrapper.appendChild(videoTitle);
                  videoWrapper.appendChild(iframe);
                  videoContainer.appendChild(videoWrapper);
              });
          })
          .catch(error => {
              console.error('Error al obtener los videos:', error);
          });
  }
  
  getChannelVideos();