import toast from "react-hot-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // Limit 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const validateImageFiles = (files) => {
  const fileArray = Array.from(files);

  for (let file of fileArray) {
    // 1. Kiểm tra định dạng tệp
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error(
        `File "${file.name}" không đúng định dạng hình ảnh (chỉ chấp nhận JPG, PNG, WEBP, GIF)!`,
      );
      return false;
    }

    // 2. Kiểm tra dung lượng tệp
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File "${file.name}" vượt quá dung lượng tối đa 5MB!`);
      return false;
    }
  }

  return true;
};
