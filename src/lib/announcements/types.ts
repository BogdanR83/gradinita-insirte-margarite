export type Announcement = {
  id: string;
  title: string;
  body?: string;
  pdfUrl?: string;
  pdfName?: string;
  createdAt: string;
};

export type AnnouncementInput = {
  title: string;
  body?: string;
  pdfUrl?: string;
  pdfName?: string;
};
