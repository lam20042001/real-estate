import cloudinary from 'cloudinary';
import 'dotenv/config'
import Ad from '../models/ad.js';
import nodemailer from 'nodemailer';
import User from '../models/user.js';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
    }
});
const sendEmail = (to, subject, html) => {
    let mailOptions = {
        from: 'campcnd17@gmail.com',
        to: to,
        subject: subject,
        html: html
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
}
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
export const uploadImage = async (req, res) => {
    try {
        const { image } = req.body;
        const base64Image = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        cloudinary.v2.uploader.upload_stream({ folder: 'realestate', resource_type: 'auto' }, async (error, result) => {
            res.json({ data: result.secure_url });
            if (error) throw new Error(error);
        }).end(base64Image);
    } catch (error) {
        res.json({ error: "Something went wrong" });
        console.log(error);
    }
}
export const removeImage = async (req, res) => {
    try {
        const { public_id } = req.body;
        cloudinary.v2.uploader.destroy(public_id, async (error, result) => {
            if (error) throw new Error(error);
            res.json({ ok: true });
        });
    } catch (error) {
        console.log(error);
    }
}
export const create = async (req, res) => {
    try {
        console.log(req.body)
        const { photos, description, title, address, price, landsize, bathrooms, bedrooms } = req.body;
        if (!photos?.length) {
            return res.json({ error: "Photos are required" });
        }
        if (!price) {
            return res.json({ error: "Price is required" });
        }
        if (!address) {
            return res.json({ error: "Address is required" });
        }
        if (!description) {
            return res.json({ error: "Description is required" });
        }
        if (!title) {
            return res.json({ error: "Tile is required" });
        }
        if (!bedrooms) {
            return res.json({ error: "Number of bedrooms is required" });
        }
        if (!bathrooms) {
            return res.json({ error: "Number of bathrooms is required" });
        }
        if (!landsize) {
            return res.json({ error: "Landsize is required" });
        }
        const ad = await new Ad({
            ...req.body,
            postedBy: req.user._id,
            slug: slugify(`${address}-${price}-${nanoid(6)}`),
        }).save();
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: { role: "Seller" },
            },
            { new: true }
        );
        user.password = undefined;
        user.resetCode = undefined;
        res.json({ ad, user });
    } catch (err) {
        res.json({ error: "Something went wrong. Try again." });
        console.log(err);
    }
};
export const ads = async (req, res) => {
    try {
        const adsForSell = await Ad.find({ action: "sell" })
            .sort({ createdAt: -1 })
            .limit(20);
        const adsForRent = await Ad.find({ action: "rent" })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json({ adsForSell, adsForRent });
    } catch (err) {
        console.log(err);
    }
};
export const read = async (req, res) => {
    try {
        console.log(req.params.slug)
        const ad = await Ad.findOne({ slug: req.params.slug }).populate(
            "postedBy",
            "name username email phone company "
        );
        res.json({ ad });
    } catch (err) {
        console.log(err);
    }
};
export const addToWishlist = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: { wishlist: req.body.adId },
            },
            { new: true }
        );
        const { password, resetCode, ...rest } = user._doc;
        res.json(rest);
    } catch (err) {
        console.log(err);
    }
};
export const removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: { wishlist: req.params.adId },
            },
            { new: true }
        );
        const { password, resetCode, ...rest } = user._doc;
        res.json(rest);
    } catch (err) {
        console.log(err);
    }
};
export const contactSeller = async (req, res) => {
    try {
        const { name, email, message, phone, adId } = req.body;
        const ad = await Ad.findById(adId).populate("postedBy", "email");
        const user = await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { enquiredProperties: adId },
        });
        if (!user) {
            return res.json({ error: "Could not find user with that email" });
        } else {
            const html = `
        <p>You have received a new customer enquiry</p>
        <h4>Customer details</h4>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Message: ${message}</p>
        <a href="${process.env.CLIENT_URL}/ad/${ad.slug}">${ad.address} for ${ad.action} ${ad.price}</a>`;
            sendEmail(ad?.postedBy?.email, `Enquiry about ${ad?.title}`, html);
            res.json({ ok: true });
        }
    } catch (err) {
        console.log(err);
    }
};
export const userAds = async (req, res) => {
    try {
        console.log(req.user._id)
        const ads = await Ad.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
        console.log(ads.length)
        res.json({ ads, total: ads.length });
    } catch (err) {
        console.log(err);
        res.json({ error: "Something went wrong" });
    }
};
export const update = async (req, res) => {
    try {
        const { photos, price, bedrooms, bathrooms, address, title, landsize, description } = req.body;
        const ad = await Ad.findById(req.params._id);
        const owner = req.user._id == ad?.postedBy;
        if (!owner) {
            return res.json({ error: "Permission denied" });
        } else {
            if (!photos?.length) {
                return res.json({ error: "Photos are required" });
            }
            if (!price) {
                return res.json({ error: "Price is required" });
            }
            if (!address) {
                return res.json({ error: "Address is required" });
            }
            if (!description) {
                return res.json({ error: "Description is required" });
            }
            if (!title) {
                return res.json({ error: "Tile is required" });
            }
            if (!bedrooms) {
                return res.json({ error: "Number of bedrooms is required" });
            }
            if (!bathrooms) {
                return res.json({ error: "Number of bathrooms is required" });
            }
            if (!landsize) {
                return res.json({ error: "Landsize is required" });
            }
            await Ad.findByIdAndUpdate(ad._id, {
                ...req.body,
                slug: ad.slug,
            }, { new: true });
            res.json({ ok: true });
        }
    } catch (err) {
        console.log(err);
        res.json({ error: "Something went wrong. Try again." });
    }
};
export const remove = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params._id);
        const owner = req.user._id == ad?.postedBy;
        if (!owner) {
            return res.json({ error: "Permission denied" });
        } else {
            await Ad.findOneAndDelete(ad._id);
            res.json({ ok: true });
        }
    } catch (err) {
        console.log(err);
    }
};
export const enquiriedProperties = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const ads = await Ad.find({ _id: user.enquiredProperties }).sort({
            createdAt: -1,
        });
        res.json(ads);
    } catch (err) {
        console.log(err);
    }
};
export const wishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const ads = await Ad.find({ _id: user.wishlist }).sort({
            createdAt: -1,
        });
        res.json(ads);
    } catch (err) {
        console.log(err);
    }
};
export const adsForSell = async (req, res) => {
    try {
        const ads = await Ad.find({ action: "sell" })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(ads);
    } catch (err) {
        console.log(err);
    }
};
export const adsForRent = async (req, res) => {
    try {
        const ads = await Ad.find({ action: "rent" })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(ads);
    } catch (err) {
        console.log(err);
    }
};
export const search = async (req, res) => {
    try {
        console.log(req.query)
        const { action, priceRange } = req.query;
        console.log(action, priceRange)
        const ads = await Ad.find({
            action: action == "buy" ? "sell" : "rent",
            price: {
                $gte: parseInt(priceRange[0]),
                $lte: parseInt(priceRange[1]),
            },
        })
            .limit(20)
            .sort({ createdAt: -1 })
        console.log(ads)
        res.json(ads);
    } catch (err) {
        res.json({ error: "Something went wrong" });
        console.log();
    }
};
export const agents = async (req, res) => {
    try {
        const agents = await User.find({ role: "Seller" }).select(
            "-password -role -enquiredProperties -wishlist"
        );
        res.json(agents);
    } catch (err) {
        console.log(err);
    }
};

export const agentAdCount = async (req, res) => {
    try {
        const ads = await Ad.find({ postedBy: req.params._id }).select("_id");
        res.json(ads);
    } catch (err) {
        console.log(err);
    }
};

export const agent = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select(
            "-password -role -enquiredProperties -wishlist"
        );
        const ads = await Ad.find({ postedBy: user._id }).sort({ createdAt: -1 });
        res.json({ user, ads });
    } catch (err) {
        console.log(err);
    }
};