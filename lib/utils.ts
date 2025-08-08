import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: string | Date): string => {
  const now = new Date();

  const createdAtDate =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;

  if (isNaN(createdAtDate.getTime())) {
    throw new Error("Invalid createdAt date");
  }

  const seconds = Math.floor((now.getTime() - createdAtDate.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000); // years

  if (interval >= 1) {
    return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000); // months
  if (interval >= 1) {
    return interval === 1 ? `${interval} month ago` : `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400); // days
  if (interval >= 1) {
    return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600); // hours
  if (interval >= 1) {
    return interval === 1 ? `${interval} hour ago` : `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60); // minutes
  if (interval >= 1) {
    return interval === 1
      ? `${interval} minute ago`
      : `${interval} minutes ago`;
  }

  // seconds
  return seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
};

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export const formattedDate = (date: string) => {
  return date.split("T")[0];
};

export const getFileFormat = (mimeType: string, fileName: string): string => {
  // Lấy định dạng từ MIME type
  const inferredFormat = mimeType.split("/")[1]; // Lấy phần sau dấu "/"

  // Kiểm tra nếu định dạng từ MIME type là hợp lệ
  if (inferredFormat && /^[a-zA-Z0-9]+$/.test(inferredFormat)) {
    return inferredFormat; // Nếu hợp lệ, trả về định dạng
  }

  // Fallback: Lấy đuôi file từ fileName
  const fileExtension = fileName.split(".").pop();
  if (fileExtension && /^[a-zA-Z0-9]+$/.test(fileExtension)) {
    return fileExtension; // Nếu đuôi file hợp lệ, trả về đuôi file
  }

  // Trả về "unknown" nếu không xác định được
  return "unknown";
};

export function timeSinceMessage(timestamp: Date | string) {
  const now = new Date();
  const messageTimestamp = new Date(timestamp);
  const diffInMs = now.getTime() - messageTimestamp.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) return `${diffInDays} days ago`;
  if (diffInHours > 0) return `${diffInHours} hours ago`;
  if (diffInMinutes > 0) return `${diffInMinutes} minutes ago`;
  return `${diffInSeconds} seconds ago`;
}

export function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD") // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}
