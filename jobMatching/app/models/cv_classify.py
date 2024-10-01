import numpy as np
import pandas as pd
import os

base_dir = os.path.dirname(os.path.abspath(__file__))

resume_data_path = os.path.join(base_dir, '..', 'dataset', 'Resume.csv')
resume_data = pd.read_csv(resume_data_path)

from nltk import pos_tag, sent_tokenize, word_tokenize
from nltk.corpus import stopwords

import re


def clean_text(text):
    # Remove special characters and digits
    text = re.sub(r'\W', ' ', text)
    text = re.sub(r'\d+', '', text)
    text = text.lower()
    return text


resume_data['Resume_str'] = resume_data['Resume_str'].apply(clean_text)


def preprocess_text(text):
    text = text.lower()  # Convert to lowercase
    text = re.sub('[^a-zA-Z]', ' ', text)  # Remove non-alphabetic characters
    sentences = sent_tokenize(text)
    features = {'feature': ""}  # Initialize the features dictionary
    stop_words = set(stopwords.words("english"))  # Define stop words

    for sent in sentences:
        if any(criteria in sent for criteria in ['skills', 'education']):
            words = word_tokenize(sent)  # Tokenize the sentence
            words = [word for word in words if word not in stop_words]  # Remove stop words
            tagged_words = pos_tag(words)  # Part-of-speech tagging
            # Filter out unnecessary tags
            filtered_words = [word for word, tag in tagged_words if tag not in ['DT', 'IN', 'TO', 'PRP', 'WP']]
            # Accumulate the filtered words
            features['feature'] += " ".join(filtered_words) + " "

    return features['feature'].strip()  # Return the processed text as a string


resume_data['Processed_Resume_str'] = resume_data['Resume_str'].apply(preprocess_text)

from sklearn.feature_extraction.text import TfidfVectorizer

tfidf = TfidfVectorizer(stop_words='english')
X = tfidf.fit_transform(resume_data['Processed_Resume_str'])

from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB

X_train, X_test, y_train, y_test = train_test_split(X, resume_data['Category'], test_size=0.2, random_state=42)

model = MultinomialNB()
model.fit(X_train, y_train)


def classify_resume(new_resume_text):
    processed_text = preprocess_text(new_resume_text)
    text_features = tfidf.transform([processed_text])
    predicted_category = model.predict(text_features)
    return predicted_category[0]

# new_resume = """
# LA HUNG VI
# Sale Manager
#  15/03/1994
#  Male
#  0898.472.513
#  lahungvitth@gmail.com
#  Go Vap district, Ho Chi Minh City
# Skills
# Communication
# O¨ce information technology
# Effective and creative thinking
# Team Management
# Problem solving
# Time management
# Interest
# ● Sports: football, badminton
# ● Read novels/long stories
# ● Iced black coffee without sugar
# ● Face challenges & ¦nd solutions
# CAREER GOALS
# • To work in a dynamic, challenging environment with a clear career path
# • Successfully completing the assigned targets, setting goals after 1 year will be able
# to manage a team (depending on the company's orientation)
# • Long-term attachment, creating good relationships with the company's collective,
# creating value and achieving new successes with the company
# • Do my best with the team for a common goal
# EDUCATION
# 09/2012 - 10/2016
# NGUYEN TAT THANH UNIVERSITY | Finance Banking
# • Successfully completing the university training program, actively participating in the
# Youth Union's activities and social activities
# • Achieved the "Growing seeds for dreams" scholarship of Sacombank
# WORK EXPERIENCE
# 10/2021 - Now
# 24H ONLINE ADVERTISING JOINT STOCK COMPANY | Sale Executive
# • Searching for customers, consulting advertising products on online newspaper sites
# of 24h (24h.com.vn, eva.vn, mobile app Viva24h)
# • Meeting, presenting and consulting on advertising implementation solutions
# suitable to customers' needs
# • Support training new employees, support team in customer care to achieve
# common goals
# Achievement:
# • Signing contracts with companies/brands: Tan Quang Minh (Bidrico), MediaMart (in
# cooperation with Dan Tri newspaper), Rosabela pharmaceutical, iCare
# pharmaceutical, Asoft company...
# • Learn more knowledge and experience working in B2B in the Advertising/Marketing
# industry
# • Gain more relationships with new brands/agencies
# Reference person: Ms. Nhu (Sales Manager) - 0979 822 802
# 05/2021 - 10/2021
# NOVAON GROUP | Business Development Executive
# • Finding customers and introducing Digital Marketing services, IMC campaigns
# • Meeting, exploiting customer needs and consulting solutions in line with
# campaign goals
# • Coordinate with related departments to deploy effective campaigns, manage and
# report on request from customers
# • Weekly/monthly/quarterly work report
# Achievements:
# • Sign contract (content) with customer Capella Holdings (brand CHLOE Gallery)
# • Accumulate more knowledge about Digital MKT and digital transformation trends
# • Expand more relationships, improve working skills with customers and teams:
# take briefs, coordinate with teams to plan, quote and present, negotiate contracts
# and deploy campaigns, accumulate B2B work experience
# Reference person: Mr. Tai (Head of Department) - 0909 136 164CERTIFICATES
# 2016
# English B1
# 2016
# Applied Informatics B class Excellent
# WINNERS AND AWARDS
# 11/2013
# Scholarship "Growing seeds for
# dreams" - Sacombank
# 03/2020 - 05/2021
# BIZMAN INVESTMENT JOINT STOCK COMPANY | Senior Account Manager
# • Sales target: 2 billion/year
# • Finding customers, introducing outdoor advertising products
# • Meeting customers, presenting products and exploiting customer needs
# • Consulting, supporting customers to plan integrated communication
# • Managing a 3-member team, training on product knowledge, sales skills, customer
# persuasion skills, supporting members to meet and close contracts with customers
# • Weekly work report to the Director
# Achievements:
# • Signing contracts with companies/brands: An Gia Real Estate, Vung Tau Cable Car,
# Dat Viet VAC Agency (brand Redbull), CFLD Real Estate Group
# • Create good relationships with brands and agencies
# • Support the members and together with the team to complete the assigned KPI
# quite well, accumulate a lot of experience working with large domestic and foreign
# customers
# Reference person: Mr. Loc (Account Director) - 0909 124 813
# 10/2016 - 12/2019
# VIETNAM YELLOW PAGE ADVERTISING SERVICES CO., LTD | Sale Executive
# • Finding customers, approaching and persuading customers to sponsor health
# events, advertising on book/magazine publications, website advertising, outdoor
# advertising (OOH)...
# • Manage event team: plan events, assign work (set up), assign personnel to support
# the brand, monitor and report progress/results to the director
# • Support recruitment: post job vacancies, receive candidate pro¦les, schedule
# interviews and participate in interviews
# • Monthly work report
# Achievements:
# • Signing contracts with units: Vietcombank, HDbank, Taisun Vietnam, Nutifood,
# Vitadairy, Mekong hospital,... and many other large/small units
# • Accumulate a lot of experience in team management, improve working skills with
# individual and corporate customers, build a diverse customer network
# Reference person: Ms. Hoa (Director) - 0969 948 877
# 09/2014 - 12/2016
# TIN TOC JOINT STOCK COMPANY | Co-founder
# Tin Toc is a delivery and COD company
# • Support the process of conceptualizing the model and building the delivery system
# • Participate in the development of the company's development strategy
# • Coordination of goods, delivery assignment
# • Support pick up and delivery
# Reference person: Mr. Vu (Colleague) - 0384 863 807
# ACTIVITIES:
# 12/2017 - Now
# VOLUNTEER GROUP "UNDERSTANDING THE PIECE OF LIFE" | Co-founder
# • Participating in fundraising campaigns, supporting the unfortunate (homeless
# people, poor children in remote areas...)
# • Participate in activities: cooking porridge for charity (HCMC), mid-autumn festival
# for ethnic minority children (Binh Phuoc),..."""
# predicted_category = classify_resume(new_resume)
# print(f'Predicted Category: {predicted_category}')
