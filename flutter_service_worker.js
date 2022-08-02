'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "705918db4fe496d2ece704af0d1c9ff1",
"index.html": "81e6824c020985be54018442e1c586ec",
"/": "81e6824c020985be54018442e1c586ec",
"main.dart.js": "313d403bc568aa42ee35f1c72ed0e26b",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "21501113a02b5ddd89aa962e33d236c4",
"assets/AssetManifest.json": "f716a517a4f0b5672566ef4008389e4b",
"assets/NOTICES": "1797a86eaa75bde382b692c5ca02d216",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/img22.jpg": "0e3ef48222552cf3ec7a1a2167a87fb2",
"assets/assets/img23.jpg": "dabd168b8437c49c73ae6a429dd6d4b8",
"assets/assets/img21.jpg": "0e202361db42f82149b42d9904b3b974",
"assets/assets/img20.jpg": "0c14756267bc2a0da7623228bead476d",
"assets/assets/img24.jpg": "0e400e40b250e277da9dd5491fa32810",
"assets/assets/img18.jpg": "4100439bb528b5ab7d1246e56ffb123c",
"assets/assets/img19.jpg": "5257b757c7b4c1e895253bd863de510c",
"assets/assets/img9.jpg": "42943c49a27b53e92376d0cf806642c6",
"assets/assets/img8.jpg": "d142a9a5e8950f3accd78797c5e60d92",
"assets/assets/background.png": "1f632f1df8a41227b1863ec6db045eb6",
"assets/assets/img5.jpg": "e3573057c860d70b787728ded3567a1e",
"assets/assets/img4.jpg": "24482e2efa200c0d0af11bb87d56cbfc",
"assets/assets/img6.jpg": "6412f335bc2a99420ddadb848b95a2e7",
"assets/assets/img7.jpg": "b36ea1369317ebf69e0879882a6203a7",
"assets/assets/logo.png": "b2ae82b0ab6c43db69cd16293ba6339c",
"assets/assets/img3.jpg": "3b2d014222b6f1976aaff27a02784242",
"assets/assets/img2.jpg": "9b708f39e10e670e85532f97725b1c3c",
"assets/assets/img1.jpg": "23e461cb73ebb354a7f53363533c398b",
"assets/assets/electrician_vector.png": "10758c92fad191dbb655ede1b74a9577",
"assets/assets/intro_vector.png": "30888b051a752d922eff2f3b7f229c15",
"assets/assets/img17.jpg": "70413c80435c17eef0eecb1f29307cc1",
"assets/assets/img16.jpg": "d9d8559c26c39e9fc667ee39c50101bb",
"assets/assets/img14.jpg": "cbf960f2869c55286dd31c2665f87d86",
"assets/assets/meet_vector.png": "422ab5dc85f8928d113654a9cb2ddeab",
"assets/assets/img15.jpg": "4dc653b78ebab30af8c7889e80eaf399",
"assets/assets/img11.jpg": "47627716aed3a867a1f1a0d5b4ebd6b6",
"assets/assets/img10.jpg": "6828b236b59b1aa25d83100a7f1655eb",
"assets/assets/img12.jpg": "e858399a5f5523c52d2031604a5fe45b",
"assets/assets/wire_vector.png": "0e1cc831ac7df6c8eba5b5d0f04fb075",
"assets/assets/img13.jpg": "91a1af711131cb0e37f906a22eb363f2",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
