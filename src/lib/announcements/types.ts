import type { AnnouncementCategory } from "./categories";

export type AnnouncementFile = {
  url: string;
  name: string;
};

export type Announcement = {
  id: string;
  title: string;
  body?: string;
  files: AnnouncementFile[];
  category: AnnouncementCategory;
  createdAt: string;
};

export type AnnouncementInput = {
  title: string;
  body?: string;
  files?: AnnouncementFile[];
  category: AnnouncementCategory;
};

export type StoredAnnouncement = {
  id: string;
  title: string;
  body?: string;
  pdfUrl?: string;
  pdfName?: string;
  files?: AnnouncementFile[];
  category?: string;
  createdAt: string;
};
