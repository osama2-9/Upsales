import { prisma } from "../prisma/prismaClient.js";
export const addNewMedia = async (req, res) => {
  try {
    const {
      title,
      type,
      director,
      duration,
      budget,
      location,
      year,
      userId,
      posterUrl,
    } = req.body;

    const media = await prisma.media.create({
      data: {
        title,
        type,
        duration,
        director,
        budget,
        location,
        year,
        posterUrl,
        userId: parseInt(userId),
      },
    });

    if (!media) {
      return res.status(400).json({ error: "Failed to add media" });
    }

    return res.status(201).json({
      message: "Media Created",
      media,
    });
  } catch (error) {
    console.error("Error adding media:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateMedia = async (req, res) => {
  try {
    const {
      mediaId,
      title,
      type,
      director,
      duration,
      budget,
      location,
      year,
      userId,
      posterUrl,
    } = req.body;

    const findMedia = await prisma.media.findUnique({
      where: {
        mediaId: mediaId,
      },
    });
    if (!findMedia) {
      return res.status(400).json({
        error: "Media not avilable",
      });
    }

    const updateMedia = await prisma.media.update({
      where: {
        mediaId: mediaId,
      },
      data: {
        title,
        type,
        director,
        duration,
        budget,
        location,
        posterUrl,
        year,
        userId,
        updatedAt: new Date(),
      },
    });
    if (!updateMedia) {
      return res.status(400).json({
        error: "Feaild to update media",
      });
    }
    return res.status(200).json({
      message: "Media Updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.query;
    if (!mediaId) {
      return res.status(400).json({
        error: "Media Id required",
      });
    }
    const findMedia = await prisma.media.findUnique({
      where: {
        mediaId: parseInt(mediaId),
      },
    });
    if (!findMedia) {
      return res.status(400).json({
        error: "Media not avilable",
      });
    }
    const deleteMedia = await prisma.media.delete({
      where: {
        mediaId: parseInt(mediaId),
      },
    });
    if (!deleteMedia) {
      return res.status(400).json({
        error: "Feaild to delete media",
      });
    }
    return res.status(200).json({
      message: "Media deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getMedia = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", type = "" } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    const where = {};

    if (search) {
      where.title = {
        contains: search,
      };
    }

    if (type) {
      where.type = type;
    }

    const total = await prisma.media.count({ where });

    const media = await prisma.media.findMany({
      where,
      skip,
      take: limitInt,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        mediaId: true,
        title: true,
        director: true,
        duration: true,
        budget: true,
        location: true,
        posterUrl: true,
        type: true,
        user: {
          select: {
            name: true,
          },
        },
        year: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: media,
      pagination: {
        total,
        page: pageInt,
        limit: limitInt,
        totalPages: Math.ceil(total / limitInt),
      },
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMediaById = async (req, res) => {
  try {
    const { mediaId } = req.query;
    const mediaIdInt = parseInt(mediaId);

    const media = await prisma.media.findUnique({
      where: {
        mediaId: mediaIdInt,
      },
      select: {
        mediaId: true,
        title: true,
        director: true,
        duration: true,
        budget: true,
        location: true,
        posterUrl: true,
        type: true,
        user: {
          select: {
            name: true,
          },
        },
        year: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!media) {
      return res.status(400).json({
        error: "Media not found",
      });
    }
    return res.status(200).json({
      data: media,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
