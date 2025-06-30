import ProductReview from "../models/ProductReview.js";

// Lấy toàn bộ review (kể cả ẩn) — dùng cho
export const GetAllReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find()
      .populate("user_id", "name email")
      .populate("product_id", "name");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết 1 review
export const GetReviewById = async (req, res) => {
  try {
    const review = await ProductReview.findById(req.params.id)
      .populate("user_id", "name email")
      .populate("product_id", "name");

    if (!review) return res.status(404).json({ error: "Review not found" });

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Chuyển trạng thái ẩn/hiện
export const ToggleReviewVisibility = async (req, res) => {
  try {
    const review = await ProductReview.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    review.is_visible = !review.is_visible;
    await review.save();

    res.json({
      message: `Review is now ${review.is_visible ? "visible" : "hidden"}`,
      is_visible: review.is_visible,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const AddUserReview = async (req, res) => {
  const { product_id, rating, comment } = req.body;
  const user_id = req.user._id; 

  try {
    const existing = await ProductReview.findOne({ user_id, product_id });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Bạn đã đánh giá sản phẩm này rồi" });
    }
    const newReview = new ProductReview({
      user_id,
      product_id,
      rating,
      comment,
      is_visible: true, 
    });

    await newReview.save();
    res.status(201).json({ message: "Đánh giá thành công", review: newReview });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
