import type { Image } from "$lib/types";
import { supabase } from "$lib/supabase/client";
import prisma from '$lib/prisma';

export const getResult = async (select: string | null, getImages?: boolean) => {
  if (!supabase) throw new Error("Supabase not initialized");

  const numposts = await prisma.blog.count();
  const posts = select === "posts" ? await prisma.blog.findMany() : [];

  const numexperience = await prisma.experience.count();
  const experience = select === "experience" ? await prisma.experience.findMany() : [];

  const numskills = await prisma.skills.count();
  const skills = select === "skills" ? await prisma.skills.findMany() : [];

  const numprojects = await prisma.projects.count();
  const projects = select === "projects" ? await prisma.projects.findMany() : [];

  let images: Image[] = [];
  if (select === "images" || getImages) {
    const { data: imageData } = await supabase.storage.from("images").list();
    images = (imageData || []).filter(
      image =>
        image.name.endsWith(".png") ||
        image.name.endsWith(".jpg") ||
        image.name.endsWith(".jpeg") ||
        image.name.endsWith(".svg") ||
        image.name.endsWith(".webp")
    );
  }

  return {
    success: true,
    numposts,
    posts: posts.map(post => ({ ...post, id: Number(post.id), tags: (post.tags as string[]) })),
    numimages: images.length,
    images: select === "images" ? images : [],
    numexperience,
    experience: experience.map(exp => ({ ...exp, id: Number(exp.id) })),
    numskills,
    skills: skills.map(skill => ({ ...skill, id: Number(skill.id) })),
    numprojects,
    projects: projects.map(project => ({ ...project, id: Number(project.id) })),
  };
};
