# -*- coding: utf-8 -*-

import datetime
import sqlite3
import pickle
import zlib
import numpy as np
from numpy import array
from scipy import interpolate


videoID_viewcount = pickle.load(open('../../tdb/videoID_historyViewcount_forDemo.pickle'))
videoID_date_time_author_content = pickle.load(open('../../tdb/videoID_date_time_author_content_forDemo.pickle'))
videoID_numTweet = pickle.load(open('../../tdb/videoID_numTweet_from2009-07-31_to2009-11-01_forDemo.pickle'))

videoID_tweeterNumAT = pickle.load(open('../../tdb/videoID_TwitterUserNumAT.pickle'))
videoID_tweeterNumRT = pickle.load(open('../../tdb/videoID_TwitterUserNumRT.pickle'))
videoID_tweeterNumNbcTweet = pickle.load(open('../../tdb/videoID_TwitterUserNumNbcTweet.pickle'))
videoID_tweeterNumHashtag = pickle.load(open('../../tdb/videoID_TwitterUserNumHashtag.pickle'))

videoID_tweeterOutdegree = pickle.load(open('../../tdb/videoID_TwitterUserOutdegree.pickle'))


videoID_featureName_score = pickle.load(open('../../tdb/videoID_featureName_score_sampled.pickle'))
# process array
for videoID in videoID_featureName_score.iterkeys():
    videoID_featureName_score[videoID]['intercept'] =  [x[0] for x in videoID_featureName_score[videoID]['intercept']]




output_db = sqlite3.connect('../../db.sqlite3')
output_cursor = output_db.cursor()

leftDate = datetime.date(2000,1,1)
rightDate = datetime.date(2010,3,1)
dateDelta = datetime.timedelta(1)
dateShift = datetime.timedelta(0)

# prepare for viewcount
videoID_dailyViewcountString = {}
for videoID, (headDate, tailDate, currentCount, historyViewcountPercentage) in videoID_viewcount.iteritems():

    x = np.linspace(0, (tailDate - headDate).days, 100)
    f = interpolate.interp1d(x, historyViewcountPercentage)

    # generate date : daily viewcount
    date_viewcount = []
    for i in range(0, 10000):
        d = headDate+i*dateDelta
        if d < leftDate:
            continue
        if d > rightDate or d > tailDate:
            break

        if d > datetime.date(2009,11,1) and (d - datetime.date(2009,11,1)).days % 10 != 0:
            continue

        date_viewcount.append({'d':str(d), 'c': int(f((d-headDate).days)*currentCount/100.0)})

    videoID_dailyViewcountString[videoID] = str(date_viewcount)

# prepare for numTweet
videoID_dailyTweetString = {}

for videoID, dailyNumTweet in videoID_numTweet.iteritems():

    (uploadDate, _, _, _) = videoID_viewcount[videoID]
    date_numTweet = []
    d = max(leftDate, uploadDate)
    while d <= datetime.date(2009,11,1):
        date_numTweet.append( {'d':str(d+dateShift), 'c': dailyNumTweet[(d-datetime.date(2009,7,31)).days]} )
        d += dateDelta

    videoID_dailyTweetString[videoID] = str(date_numTweet)

# prepare for videoID_tweetContent videoID: [ date : [{'time':'', 'author':'', 'tweet':''}] ...]
videoID_tweetContentString = {}
for videoID, date_time_author_content in videoID_date_time_author_content.iteritems():
    tweetContentInfo = {}
    tmp = sorted(date_time_author_content.items())
    for dateStr, timeStr_author_tweet in tmp:
        tweetContentInfo[dateStr] = []
        for timeStr, author, tweet in sorted(timeStr_author_tweet):
            tweetContentInfo[dateStr].append({'time':timeStr, 'author':author, 'tweet':tweet})
            
    videoID_tweetContentString[videoID] = str(tweetContentInfo)




for i, (videoID, dailyViewcountString) in enumerate(videoID_dailyViewcountString.iteritems()):

    dailyNumTweet = videoID_dailyTweetString[videoID]
    tweetContent = videoID_tweetContentString[videoID]
    featureScore = str(list(map(list, videoID_featureName_score[videoID].iteritems())))

    # feature summary
    activeFeature = str([
        ['#mention', videoID_tweeterNumAT[videoID]],
        ['#retweet', videoID_tweeterNumRT[videoID]],
        ['#nbctweet', videoID_tweeterNumNbcTweet[videoID]],
        ['#hashtag', videoID_tweeterNumHashtag[videoID]]])
        

    graphFeature = str([
        ['#followers', videoID_tweeterOutdegree[videoID]]])

    output_cursor.execute( "INSERT INTO demo_video ( videoID, videoIndex, dailyViewcount, dailyTweet, tweetContent, featureScore, activeFeature, graphFeature) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
                           (videoID, i, buffer(zlib.compress(dailyViewcountString)), buffer(zlib.compress(dailyNumTweet)), buffer(zlib.compress(tweetContent)), buffer(zlib.compress(featureScore)), buffer(zlib.compress(activeFeature)), buffer(zlib.compress(graphFeature))))
        
    
output_db.commit()
