import indexHtml from '../../index.html';
import gameBundle from '../build/game.iife.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(indexHtml, {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
    if (url.pathname === '/src/build/game.iife.js') {
      return new Response(gameBundle, {
        headers: {
          'content-type': 'application/javascript; charset=UTF-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
    return new Response('Not Found', { status: 404 });
  }
};
