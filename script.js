// استفاده از FFmpeg.js برای پردازش و تبدیل فایل‌ها
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    // گرفتن نام فایل خروجی از ورودی کاربر
    const outputName = document.getElementById("mo12s").value || "output.gif";
    const fileInput = document.getElementById("filev").files[0];

    // بررسی وجود فایل ورودی
    if (!fileInput) {
        alert("لطفاً یک فایل ورودی انتخاب کنید.");
        return;
    }

    // بارگذاری کتابخانه FFmpeg.js
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }

    const fileExtension = fileInput.name.split(".").pop().toLowerCase();
    const inputFileName = `input.${fileExtension}`;

    // ذخیره فایل ورودی در حافظه FFmpeg
    ffmpeg.FS("writeFile", inputFileName, await fetchFile(fileInput));

    try {
        // اجرای تبدیل بر اساس نوع فایل
        if (fileExtension === "mp4") {
            // تبدیل ویدئو به گیف
            await ffmpeg.run("-i", inputFileName, "-vf", "fps=10,scale=320:-1:flags=lanczos", outputName);
        } else if (fileExtension === "gif") {
            // تبدیل گیف به ویدئو
            await ffmpeg.run("-i", inputFileName, "-c:v", "libx264", "-preset", "ultrafast", outputName.replace(".gif", ".mp4"));
        } else {
            alert("فقط فایل‌های MP4 یا GIF مجاز هستند.");
            return;
        }

        // دریافت فایل خروجی
        const outputFile = ffmpeg.FS("readFile", outputName);
        const url = URL.createObjectURL(new Blob([outputFile.buffer], { type: fileExtension === "mp4" ? "image/gif" : "video/mp4" }));

        // تنظیم لینک دانلود فایل خروجی
        const downloadLink = document.getElementById("outputLink");
        downloadLink.href = url;
        downloadLink.download = outputName;

        // نمایش فایل خروجی در صورت گیف بودن
        const outputImage = document.getElementById("outputImage");
        outputImage.src = url;

    } catch (error) {
        console.error("خطا در پردازش فایل:", error);
        alert("مشکلی در تبدیل فایل رخ داده است.");
    }
});