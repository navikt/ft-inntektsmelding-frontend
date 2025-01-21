/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IdImport } from './routes/$id'
import { Route as IdIndexImport } from './routes/$id.index'
import { Route as RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerImport } from './routes/refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer'
import { Route as IdVisImport } from './routes/$id.vis'
import { Route as IdOppsummeringImport } from './routes/$id.oppsummering'
import { Route as IdKvitteringImport } from './routes/$id.kvittering'
import { Route as IdInntektOgRefusjonImport } from './routes/$id.inntekt-og-refusjon'
import { Route as IdDineOpplysningerImport } from './routes/$id.dine-opplysninger'
import { Route as RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer6KvitteringImport } from './routes/refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer.6-kvittering'
import { Route as RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer5OppsummeringImport } from './routes/refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer.5-oppsummering'
import { Route as RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer4RefusjonImport } from './routes/refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer.4-refusjon'
import { Route as RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer3OmsorgsdagerImport } from './routes/refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer.3-omsorgsdager'
import { Route as RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer2AnsattOgArbeidsgiverImport } from './routes/refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer.2-ansatt-og-arbeidsgiver'
import { Route as RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer1IntroImport } from './routes/refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer.1-intro'

// Create/Update Routes

const IdRoute = IdImport.update({
  id: '/$id',
  path: '/$id',
  getParentRoute: () => rootRoute,
} as any)

const IdIndexRoute = IdIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => IdRoute,
} as any)

const RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRoute =
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerImport.update({
    id: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer',
    path: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer',
    getParentRoute: () => rootRoute,
  } as any)

const IdVisRoute = IdVisImport.update({
  id: '/vis',
  path: '/vis',
  getParentRoute: () => IdRoute,
} as any)

const IdOppsummeringRoute = IdOppsummeringImport.update({
  id: '/oppsummering',
  path: '/oppsummering',
  getParentRoute: () => IdRoute,
} as any)

const IdKvitteringRoute = IdKvitteringImport.update({
  id: '/kvittering',
  path: '/kvittering',
  getParentRoute: () => IdRoute,
} as any)

const IdInntektOgRefusjonRoute = IdInntektOgRefusjonImport.update({
  id: '/inntekt-og-refusjon',
  path: '/inntekt-og-refusjon',
  getParentRoute: () => IdRoute,
} as any)

const IdDineOpplysningerRoute = IdDineOpplysningerImport.update({
  id: '/dine-opplysninger',
  path: '/dine-opplysninger',
  getParentRoute: () => IdRoute,
} as any)

const RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer6KvitteringRoute =
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer6KvitteringImport.update({
    id: '/6-kvittering',
    path: '/6-kvittering',
    getParentRoute: () =>
      RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRoute,
  } as any)

const RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer5OppsummeringRoute =
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer5OppsummeringImport.update(
    {
      id: '/5-oppsummering',
      path: '/5-oppsummering',
      getParentRoute: () =>
        RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRoute,
    } as any,
  )

const RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer4RefusjonRoute =
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer4RefusjonImport.update({
    id: '/4-refusjon',
    path: '/4-refusjon',
    getParentRoute: () =>
      RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRoute,
  } as any)

const RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer3OmsorgsdagerRoute =
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer3OmsorgsdagerImport.update(
    {
      id: '/3-omsorgsdager',
      path: '/3-omsorgsdager',
      getParentRoute: () =>
        RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRoute,
    } as any,
  )

const RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer2AnsattOgArbeidsgiverRoute =
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer2AnsattOgArbeidsgiverImport.update(
    {
      id: '/2-ansatt-og-arbeidsgiver',
      path: '/2-ansatt-og-arbeidsgiver',
      getParentRoute: () =>
        RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRoute,
    } as any,
  )

const RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer1IntroRoute =
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer1IntroImport.update({
    id: '/1-intro',
    path: '/1-intro',
    getParentRoute: () =>
      RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/$id': {
      id: '/$id'
      path: '/$id'
      fullPath: '/$id'
      preLoaderRoute: typeof IdImport
      parentRoute: typeof rootRoute
    }
    '/$id/dine-opplysninger': {
      id: '/$id/dine-opplysninger'
      path: '/dine-opplysninger'
      fullPath: '/$id/dine-opplysninger'
      preLoaderRoute: typeof IdDineOpplysningerImport
      parentRoute: typeof IdImport
    }
    '/$id/inntekt-og-refusjon': {
      id: '/$id/inntekt-og-refusjon'
      path: '/inntekt-og-refusjon'
      fullPath: '/$id/inntekt-og-refusjon'
      preLoaderRoute: typeof IdInntektOgRefusjonImport
      parentRoute: typeof IdImport
    }
    '/$id/kvittering': {
      id: '/$id/kvittering'
      path: '/kvittering'
      fullPath: '/$id/kvittering'
      preLoaderRoute: typeof IdKvitteringImport
      parentRoute: typeof IdImport
    }
    '/$id/oppsummering': {
      id: '/$id/oppsummering'
      path: '/oppsummering'
      fullPath: '/$id/oppsummering'
      preLoaderRoute: typeof IdOppsummeringImport
      parentRoute: typeof IdImport
    }
    '/$id/vis': {
      id: '/$id/vis'
      path: '/vis'
      fullPath: '/$id/vis'
      preLoaderRoute: typeof IdVisImport
      parentRoute: typeof IdImport
    }
    '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer': {
      id: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer'
      path: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer'
      fullPath: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer'
      preLoaderRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerImport
      parentRoute: typeof rootRoute
    }
    '/$id/': {
      id: '/$id/'
      path: '/'
      fullPath: '/$id/'
      preLoaderRoute: typeof IdIndexImport
      parentRoute: typeof IdImport
    }
    '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/1-intro': {
      id: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/1-intro'
      path: '/1-intro'
      fullPath: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/1-intro'
      preLoaderRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer1IntroImport
      parentRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerImport
    }
    '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/2-ansatt-og-arbeidsgiver': {
      id: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/2-ansatt-og-arbeidsgiver'
      path: '/2-ansatt-og-arbeidsgiver'
      fullPath: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/2-ansatt-og-arbeidsgiver'
      preLoaderRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer2AnsattOgArbeidsgiverImport
      parentRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerImport
    }
    '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/3-omsorgsdager': {
      id: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/3-omsorgsdager'
      path: '/3-omsorgsdager'
      fullPath: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/3-omsorgsdager'
      preLoaderRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer3OmsorgsdagerImport
      parentRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerImport
    }
    '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/4-refusjon': {
      id: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/4-refusjon'
      path: '/4-refusjon'
      fullPath: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/4-refusjon'
      preLoaderRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer4RefusjonImport
      parentRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerImport
    }
    '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/5-oppsummering': {
      id: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/5-oppsummering'
      path: '/5-oppsummering'
      fullPath: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/5-oppsummering'
      preLoaderRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer5OppsummeringImport
      parentRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerImport
    }
    '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/6-kvittering': {
      id: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/6-kvittering'
      path: '/6-kvittering'
      fullPath: '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/6-kvittering'
      preLoaderRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer6KvitteringImport
      parentRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerImport
    }
  }
}

// Create and export the route tree

interface IdRouteChildren {
  IdDineOpplysningerRoute: typeof IdDineOpplysningerRoute
  IdInntektOgRefusjonRoute: typeof IdInntektOgRefusjonRoute
  IdKvitteringRoute: typeof IdKvitteringRoute
  IdOppsummeringRoute: typeof IdOppsummeringRoute
  IdVisRoute: typeof IdVisRoute
  IdIndexRoute: typeof IdIndexRoute
}

const IdRouteChildren: IdRouteChildren = {
  IdDineOpplysningerRoute: IdDineOpplysningerRoute,
  IdInntektOgRefusjonRoute: IdInntektOgRefusjonRoute,
  IdKvitteringRoute: IdKvitteringRoute,
  IdOppsummeringRoute: IdOppsummeringRoute,
  IdVisRoute: IdVisRoute,
  IdIndexRoute: IdIndexRoute,
}

const IdRouteWithChildren = IdRoute._addFileChildren(IdRouteChildren)

interface RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRouteChildren {
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer1IntroRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer1IntroRoute
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer2AnsattOgArbeidsgiverRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer2AnsattOgArbeidsgiverRoute
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer3OmsorgsdagerRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer3OmsorgsdagerRoute
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer4RefusjonRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer4RefusjonRoute
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer5OppsummeringRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer5OppsummeringRoute
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer6KvitteringRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer6KvitteringRoute
}

const RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRouteChildren: RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRouteChildren =
  {
    RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer1IntroRoute:
      RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer1IntroRoute,
    RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer2AnsattOgArbeidsgiverRoute:
      RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer2AnsattOgArbeidsgiverRoute,
    RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer3OmsorgsdagerRoute:
      RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer3OmsorgsdagerRoute,
    RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer4RefusjonRoute:
      RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer4RefusjonRoute,
    RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer5OppsummeringRoute:
      RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer5OppsummeringRoute,
    RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer6KvitteringRoute:
      RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer6KvitteringRoute,
  }

const RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRouteWithChildren =
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRoute._addFileChildren(
    RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRouteChildren,
  )

export interface FileRoutesByFullPath {
  '/$id': typeof IdRouteWithChildren
  '/$id/dine-opplysninger': typeof IdDineOpplysningerRoute
  '/$id/inntekt-og-refusjon': typeof IdInntektOgRefusjonRoute
  '/$id/kvittering': typeof IdKvitteringRoute
  '/$id/oppsummering': typeof IdOppsummeringRoute
  '/$id/vis': typeof IdVisRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRouteWithChildren
  '/$id/': typeof IdIndexRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/1-intro': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer1IntroRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/2-ansatt-og-arbeidsgiver': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer2AnsattOgArbeidsgiverRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/3-omsorgsdager': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer3OmsorgsdagerRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/4-refusjon': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer4RefusjonRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/5-oppsummering': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer5OppsummeringRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/6-kvittering': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer6KvitteringRoute
}

export interface FileRoutesByTo {
  '/$id/dine-opplysninger': typeof IdDineOpplysningerRoute
  '/$id/inntekt-og-refusjon': typeof IdInntektOgRefusjonRoute
  '/$id/kvittering': typeof IdKvitteringRoute
  '/$id/oppsummering': typeof IdOppsummeringRoute
  '/$id/vis': typeof IdVisRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRouteWithChildren
  '/$id': typeof IdIndexRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/1-intro': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer1IntroRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/2-ansatt-og-arbeidsgiver': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer2AnsattOgArbeidsgiverRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/3-omsorgsdager': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer3OmsorgsdagerRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/4-refusjon': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer4RefusjonRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/5-oppsummering': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer5OppsummeringRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/6-kvittering': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer6KvitteringRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/$id': typeof IdRouteWithChildren
  '/$id/dine-opplysninger': typeof IdDineOpplysningerRoute
  '/$id/inntekt-og-refusjon': typeof IdInntektOgRefusjonRoute
  '/$id/kvittering': typeof IdKvitteringRoute
  '/$id/oppsummering': typeof IdOppsummeringRoute
  '/$id/vis': typeof IdVisRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRouteWithChildren
  '/$id/': typeof IdIndexRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/1-intro': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer1IntroRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/2-ansatt-og-arbeidsgiver': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer2AnsattOgArbeidsgiverRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/3-omsorgsdager': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer3OmsorgsdagerRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/4-refusjon': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer4RefusjonRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/5-oppsummering': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer5OppsummeringRoute
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/6-kvittering': typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummer6KvitteringRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/$id'
    | '/$id/dine-opplysninger'
    | '/$id/inntekt-og-refusjon'
    | '/$id/kvittering'
    | '/$id/oppsummering'
    | '/$id/vis'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer'
    | '/$id/'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/1-intro'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/2-ansatt-og-arbeidsgiver'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/3-omsorgsdager'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/4-refusjon'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/5-oppsummering'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/6-kvittering'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/$id/dine-opplysninger'
    | '/$id/inntekt-og-refusjon'
    | '/$id/kvittering'
    | '/$id/oppsummering'
    | '/$id/vis'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer'
    | '/$id'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/1-intro'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/2-ansatt-og-arbeidsgiver'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/3-omsorgsdager'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/4-refusjon'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/5-oppsummering'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/6-kvittering'
  id:
    | '__root__'
    | '/$id'
    | '/$id/dine-opplysninger'
    | '/$id/inntekt-og-refusjon'
    | '/$id/kvittering'
    | '/$id/oppsummering'
    | '/$id/vis'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer'
    | '/$id/'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/1-intro'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/2-ansatt-og-arbeidsgiver'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/3-omsorgsdager'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/4-refusjon'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/5-oppsummering'
    | '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/6-kvittering'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IdRoute: typeof IdRouteWithChildren
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRoute: typeof RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IdRoute: IdRouteWithChildren,
  RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRoute:
    RefusjonOmsorgspengerArbeidsgiverOrganisasjonsnummerRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/$id",
        "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer"
      ]
    },
    "/$id": {
      "filePath": "$id.tsx",
      "children": [
        "/$id/dine-opplysninger",
        "/$id/inntekt-og-refusjon",
        "/$id/kvittering",
        "/$id/oppsummering",
        "/$id/vis",
        "/$id/"
      ]
    },
    "/$id/dine-opplysninger": {
      "filePath": "$id.dine-opplysninger.tsx",
      "parent": "/$id"
    },
    "/$id/inntekt-og-refusjon": {
      "filePath": "$id.inntekt-og-refusjon.tsx",
      "parent": "/$id"
    },
    "/$id/kvittering": {
      "filePath": "$id.kvittering.tsx",
      "parent": "/$id"
    },
    "/$id/oppsummering": {
      "filePath": "$id.oppsummering.tsx",
      "parent": "/$id"
    },
    "/$id/vis": {
      "filePath": "$id.vis.tsx",
      "parent": "/$id"
    },
    "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer": {
      "filePath": "refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer.tsx",
      "children": [
        "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/1-intro",
        "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/2-ansatt-og-arbeidsgiver",
        "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/3-omsorgsdager",
        "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/4-refusjon",
        "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/5-oppsummering",
        "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/6-kvittering"
      ]
    },
    "/$id/": {
      "filePath": "$id.index.tsx",
      "parent": "/$id"
    },
    "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/1-intro": {
      "filePath": "refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer.1-intro.tsx",
      "parent": "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer"
    },
    "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/2-ansatt-og-arbeidsgiver": {
      "filePath": "refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer.2-ansatt-og-arbeidsgiver.tsx",
      "parent": "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer"
    },
    "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/3-omsorgsdager": {
      "filePath": "refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer.3-omsorgsdager.tsx",
      "parent": "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer"
    },
    "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/4-refusjon": {
      "filePath": "refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer.4-refusjon.tsx",
      "parent": "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer"
    },
    "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/5-oppsummering": {
      "filePath": "refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer.5-oppsummering.tsx",
      "parent": "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer"
    },
    "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/6-kvittering": {
      "filePath": "refusjon-omsorgspenger-arbeidsgiver.$organisasjonsnummer.6-kvittering.tsx",
      "parent": "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer"
    }
  }
}
ROUTE_MANIFEST_END */
