import * as React from "react";
import { createHashRouter, Outlet } from "react-router";
import { GalleryView } from "./views/GalleryView";
import { HomeView } from "./views/HomeView";
import { PhotoDetailView } from "./views/PhotoDetailView";
import { AlbumManagementView } from "./views/AlbumManagementView";
import { OrbitView } from "./views/OrbitView";
import { AboutView } from "./views/AboutView";

const PublicRoot = () => (
  <main className="min-h-screen bg-[#F2F2F2]">
    <Outlet />
  </main>
);

export const router = createHashRouter([
  {
    path: "/",
    Component: PublicRoot,
    children: [
      { index: true, Component: HomeView },
      { path: "orbit", Component: OrbitView },
      { path: "photo/:id", Component: PhotoDetailView },
      { path: "stories", Component: GalleryView },
      { path: "about", Component: AboutView },
    ]
  },
  {
    path: "/admin",
    Component: AlbumManagementView
  }
]);
