import {
  v2 as cloudinary,
  ConfigOptions,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";

(async function () {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        throw new Error(
        "Cloudinary configuration environment variables are missing",
        );
    }

    // 1. Configuration (ใส่ Type 'ConfigOptions' เพื่อความแม่นยำ)
    const config: ConfigOptions = {
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY ,
        api_secret: CLOUDINARY_API_SECRET ,
    };

    cloudinary.config(config);

    // 2. Upload an image
    // ระบุ Type ให้กับ uploadResult เพื่อให้เข้าถึง .public_id หรือ .secure_url ได้
    try {
        const uploadResult: UploadApiResponse | undefined =
        await cloudinary.uploader.upload(
            "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
            {
            public_id: "shoes",
            },
        );

        if (uploadResult) {
            console.log("Upload Success:", uploadResult.secure_url);
        }
    } catch (error) {
            const err = error as UploadApiErrorResponse;
            console.error("Upload Error:", err.message);
    }

    // 3. Optimize delivery
    // cloudinary.url มักจะคืนค่าเป็น string เสมอ
    const optimizeUrl: string = cloudinary.url("shoes", {
        fetch_format: "auto",
        quality: "auto",
    });

    console.log("Optimized URL:", optimizeUrl);

    // 4. Transform the image
    const autoCropUrl: string = cloudinary.url("shoes", {
        crop: "auto",
        gravity: "auto",
        width: 500,
        height: 500,
    });

    console.log("Auto-crop URL:", autoCropUrl);
})();
