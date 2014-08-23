# import pickle
# from sklearn.svm import LinearSVC


# # trainingRecord = pickle.load(open('/data/lin/workspace/YouTubeAndTwitter/test/forDemo/realPredict_imbalance_early_differentDays90/tdb/3_logistic_regression/headDate2009-07-31/tailDate2009-11-01/base_date2009-05-31/timeIntervalSize15/minNumTweet1/num_sample30000/viewcountIncrease_boundary100_10000/numATinTweet__numHashtaginTweet__numTweet__numRTinTweet__numNbcTweetinTweet__outdegree__pagerank__hub__auth__ATed__RTed__nbcTweeted__tweetFreq__hashtag__AT__RT__nbcTweet__target2014_01_21_01_13_14__keyFold2014_01_16_01_00_51.pdict_pickle'))

# # videoID_target = pickle.load(open('/data/lin/workspace/YouTubeAndTwitter/test/forDemo/realPredict_imbalance_early_differentDays90/tdb/3_logistic_regression/headDate2009-07-31/tailDate2009-11-01/base_date2009-05-31/timeIntervalSize15/minNumTweet1/num_sample30000/viewcountIncrease_boundary100_10000/target2014_01_21_01_13_14'))

# numberOfEarlyVideoSampled = 200

# featureNameList = trainingRecord['featureNameList']
# featureName_originalLength = trainingRecord['featureName_originalLength']



# def unMaskFeatureOrW(maskedFeature, featureMask):
#     """ return the feature where the feature[i] = 0 when featureMask[i] = 0;
#     """
#     feature = []
#     num0 = 0
#     for i, m in enumerate(featureMask[1]):
#         if m == 1:
#             feature.append(maskedFeature[i-num0])
#         else:
#             num0 += 1
#             feature.append(0)

#     return feature


# def innerProduct(a,b):
#     if len(a) != len(b):
#         raise Exception("vector dimensions do not match")
#     ret = 0
#     for i, j in enumerate(a):
#         ret = ret + j*b[i]
#     return ret


# videoID_featureName_score = {}

# for outerLoopIndex in range(0,5):

#     # get data
#     key_test_outer = trainingRecord[outerLoopIndex]['key_test_outer']
#     feature_test_outer_masked_scaled = trainingRecord[outerLoopIndex]['feature_test_outer_masked_scaled']
#     featureMask = trainingRecord[outerLoopIndex]['featureMask']
#     prob_test_outer = trainingRecord[outerLoopIndex]['prob_test_outer']
#     featureScaleParameter = trainingRecord[outerLoopIndex]['featureScaleParameter']
#     key_train_outer = trainingRecord[outerLoopIndex]['key_train_outer']
#     model = trainingRecord[outerLoopIndex]['model']
#     feature_train_outer_masked_scaled = trainingRecord[outerLoopIndex]['feature_train_outer_masked_scaled']


#     W = unMaskFeatureOrW(list(model.raw_coef_[0][0:-1]), featureMask)
#     # for test videos
#     for videoIdx, videoID in enumerate(key_test_outer):
#         videoID_featureName_score.setdefault(videoID, {})
        
#         feature = unMaskFeatureOrW(feature_test_outer_masked_scaled[videoIdx], featureMask)

#         startIndex = 0
#         videoID_featureName_score[videoID].setdefault('intercept', [])
#         videoID_featureName_score[videoID]['intercept'].append(model.intercept_)
#         for featureName in featureNameList:
#             videoID_featureName_score[videoID].setdefault(featureName, [])
#             featureLength = featureName_originalLength[featureName]
#             videoID_featureName_score[videoID][featureName].append(innerProduct(feature[startIndex:startIndex+featureLength], W[startIndex:startIndex+featureLength]))
#             startIndex += featureLength

#     # for training videos
#     for videoIdx, videoID in enumerate(key_train_outer):
#         videoID_featureName_score.setdefault(videoID, {})
        
#         feature = unMaskFeatureOrW(feature_train_outer_masked_scaled[videoIdx], featureMask)

#         startIndex = 0
#         videoID_featureName_score[videoID].setdefault('intercept', [])
#         videoID_featureName_score[videoID]['intercept'].append(model.intercept_)
#         for featureName in featureNameList:
#             videoID_featureName_score[videoID].setdefault(featureName, [])
#             featureLength = featureName_originalLength[featureName]
#             videoID_featureName_score[videoID][featureName].append(innerProduct(feature[startIndex:startIndex+featureLength], W[startIndex:startIndex+featureLength]))
#             startIndex += featureLength



            
# sample the video
videoID_totalScore = {}
for videoID, target in videoID_target.iteritems():
    if target != 2:
        continue
    totalScore = 0
    try:
        for featureName, featureScore in videoID_featureName_score[videoID].iteritems():
            totalScore += sum(featureScore)
    except KeyError:
        print videoID

    videoID_totalScore[videoID] = totalScore

totalScore_videoID = [(v,k) for k, v in videoID_totalScore.iteritems()]

sampled_videoID = zip(*sorted(totalScore_videoID, reverse=True)[0:numberOfEarlyVideoSampled])[1]

pickle.dump(sampled_videoID, open('../../../tdb/videoID_sampled_early.pickle', 'w'))



# generate videoID_featureName_score_sampled

videoID_featureName_score_sampled = {}
for videoID in sampled_videoID:
    videoID_featureName_score_sampled[videoID] = videoID_featureName_score[videoID]

pickle.dump(videoID_featureName_score_sampled, open('../../../tdb/videoID_featureName_score_sampled.pickle', 'w'))
