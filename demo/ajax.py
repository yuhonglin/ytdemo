import json
from dajaxice.decorators import dajaxice_register
import zlib
import random
import datetime
import bsddb

from demo.models import Video

featureOldName_featureNewName = {
    'ATed' : 'P.mention',
    'RT' : 'A.RT',
    'hub' : 'G.hub',
    'RTed' : 'P.RT',
    'hashtag' : 'A.hashtag',
    'tweetFreq' : 'A.tweet',
    'outdegree' : 'G.outdegree',
    'auth' : 'G.auth',
    'numTweet' : 'T.tweet',
    'intercept' : 'intercept',
    'numHashtaginTweet' : 'T.hashtag',
    'numRTinTweet' : 'T.RT',
    'nbcTweeted' : 'P.nbcTweet',
    'numNbcTweetinTweet' : 'T.nbcTweet',
    'pagerank' : 'G.pagerank',
    'nbcTweet' : 'A.nbcTweet',
    'AT' : 'A.mention'
    }

feature_order = ['intercept', 'T.tweet', 'T.hashtag', 'T.nbcTweet', 'T.RT', 'G.outdegree', 'G.pagerank', 'G.hub', 'G.auth', 'A.tweet', 'A.hashtag', 'A.mention', 'A.nbcTweet', 'A.RT', 'P.mention', 'P.nbcTweet', 'P.RT']

@dajaxice_register
def get_videoInfo_index(request, videoIndex):
    try:
        video = Video.objects.get(videoIndex=videoIndex)
    except:
        return ''

    return json.dumps( {
            'viewcount': eval(zlib.decompress(video.dailyViewcount)),
            'numTweet': eval(zlib.decompress(video.dailyTweet)),
            'videoID': video.videoID,
            'videoIndex': videoIndex
            } )

@dajaxice_register
def get_videoInfo_videoID(request, videoID):
    try:
        video = Video.objects.get(videoID=videoID)
    except:
        return ''

    return json.dumps( {
            'viewcount': eval(zlib.decompress(video.dailyViewcount)),
            'numTweet': eval(zlib.decompress(video.dailyTweet)),
            'videoIndex': video.videoIndex,
            'videoID': videoID
            } )



@dajaxice_register
def get_tweetInfo_index(request, videoIndex, date):
    y,m,d = [int(x) for x in date.split('-')]
    video = Video.objects.get(videoIndex=videoIndex)
    try:
        return json.dumps( {
                'tweetContent': eval(zlib.decompress(video.tweetContent))[ str(datetime.datetime(y,m,d))[0:10] ]
                } )
    except KeyError:
        return ''

    


@dajaxice_register
def get_featureScore_index(request, videoIndex):
    video = Video.objects.get(videoIndex=videoIndex)
    tmp = {a:b for a, b in eval(zlib.decompress(video.featureScore))}

    ret = [[] for x in feature_order]

    for fon, score in tmp.iteritems():
        fnn = featureOldName_featureNewName[fon]
        ret[feature_order.index(fnn)] = [fnn, score]
    
    return json.dumps( {
            'featureScore': ret
            } )
