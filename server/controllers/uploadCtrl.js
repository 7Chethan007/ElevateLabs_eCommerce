const uploadCtrl = {
  uploadImage: async (req, res) => {
    try {
      const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ msg: "No image URL provided" });

    return res.json({
      public_id: "external_" + Date.now(),
      url: imageUrl
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = uploadCtrl;
