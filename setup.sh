npm init vue@latest

# Move into Vue project folder
cd $(ls -d */ | head -n 1)

# Create story-related folders
mkdir -p src/stories src/lore src/community public/assets/images

# Create markdown files for stories and lore
touch src/stories/chapter-1.md src/stories/chapter-2.md
touch src/lore/society.md src/lore/wta-history.md src/lore/creatures.md
touch src/community/prompts.md src/community/reader-submissions.md

# Create initial Vue component structure
mkdir -p src/components src/pages
touch src/components/StoryCard.vue src/pages/HomePage.vue src/pages/LorePage.vue src/pages/CommunityPage.vue

# Add assets folder
touch public/assets/styles.css public/assets/logo.png

# Create basic README.md
cat <<EOT >> README.md
# Empire of Cards: The Avelian Chronicles

Welcome to Estafyn's world-building repository, where stories and history merge.

## Structure
- \`src/stories\`: Serialized story entries
- \`src/lore\`: World-building and history entries
- \`src/community\`: Community prompts and feedback entries
EOT

echo "Project structure for Empire of Cards created successfully!"