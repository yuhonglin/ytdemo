from django.db import models

# Create your models here.

class Video(models.Model):
    def __unicode__(self):  # Python 3: def __str__(self):
        return self.dataID

    videoIndex = models.IntegerField(default=-1)
    videoID = models.CharField(max_length=20)
    dailyViewcount = models.CharField(max_length=3000)
    dailyTweet = models.CharField(max_length=10000)
    tweetContent = models.CharField(max_length=20000)
    featureScore = models.CharField(max_length=10000)
    
    # feature summary
    activeFeature = models.CharField(max_length=3000)
    graphFeature = models.CharField(max_length=3000)

    # rank and type
    rankInPredictor = models.IntegerField(default=-1)
    instanceType = models.CharField(max_length=100)
    
