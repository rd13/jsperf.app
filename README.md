# jsPerf.app

![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=jsperf-app)

[jsPerf.app](https://jsperf.app) is an online JavaScript performance benchmark test runner & jsperf.com mirror. It is a complete rewrite in homage to the once excellent jsperf.com now with hopefully a more modern & maintainable codebase.

jsperf.com URLs are mirrored at the same path, e.g:

> [https://jsperf.com/negative-modulo/2](https://jsperf.com/negative-modulo/2)

Can be accessed at:

> [https://jsperf.app/negative-modulo/2](https://jsperf.app/negative-modulo/2)

## Development

This project uses NextJS / MongoDB. For local development clone the repository and create a `.env.local` file with the following:

```sh
MONGODB_URI=
MONGODB_COLLECTION=
```

The local development server can then be run with `yarn dev`.

### Phase 1 - Complete
- Replicate traditional functionality / workflow
- GitHub auth / JWT auth
- jsPerf.com mirror

### Phase 2 
- Single Page Application

### Phase 3 
- Browserscope like service for logging browser performance statistics
