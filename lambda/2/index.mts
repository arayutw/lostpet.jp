import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3"
import { MediaConvertClient, CreateJobCommand } from "@aws-sdk/client-mediaconvert"
import { S3Event } from "aws-lambda"
import path from "path"

class Process {
    private readonly S3: S3Client = new S3Client({
        region: process.env.REGION,
    })

    private readonly MediaConvert: MediaConvertClient = new MediaConvertClient({
        endpoint: process.env.ENDPOINT,
    })

    constructor(bucket: string, key: string) {
        const matches = path.parse(key).base.match(/m([0-9]+)s([0-9]+)x([0-9]+)z\.(mp4|mov)/)!;

        this.S3.send(new HeadObjectCommand({
            Bucket: bucket,
            Key: key,
        }))
            .then(() => this.MediaConvert.send(new CreateJobCommand(parseInt(matches[3], 10) > parseInt(matches[2], 10) ? {
                "Queue": process.env.QUEUE,
                "JobTemplate": "lostpetjp-v",
                "Role": process.env.ROLE,
                "Settings": {
                    "OutputGroups": [{
                        "Name": "File Group",
                        "Outputs": [{
                            "ContainerSettings": {
                                "Container": "RAW"
                            },
                            "VideoDescription": {
                                "Height": 720,
                                "ScalingBehavior": "DEFAULT",
                                "TimecodeInsertion": "DISABLED",
                                "AntiAlias": "ENABLED",
                                "Sharpness": 50,
                                "CodecSettings": {
                                    "Codec": "FRAME_CAPTURE",
                                    "FrameCaptureSettings": {
                                        "FramerateNumerator": 1,
                                        "FramerateDenominator": 5,
                                        "MaxCaptures": 1,
                                        "Quality": 80
                                    }
                                },
                                "DropFrameTimecode": "ENABLED",
                                "ColorMetadata": "INSERT"
                            }
                        }],
                        "OutputGroupSettings": {
                            "Type": "FILE_GROUP_SETTINGS",
                            "FileGroupSettings": {
                                "Destination": "s3://" + bucket + "/media-convert/"
                            }
                        }
                    },
                    {
                        "Name": "Apple HLS",
                        "Outputs": [{
                            "ContainerSettings": {
                                "Container": "M3U8",
                                "M3u8Settings": {
                                    "AudioFramesPerPes": 4,
                                    "PcrControl": "PCR_EVERY_PES_PACKET",
                                    "PmtPid": 480,
                                    "PrivateMetadataPid": 503,
                                    "ProgramNumber": 1,
                                    "PatInterval": 0,
                                    "PmtInterval": 0,
                                    "Scte35Source": "NONE",
                                    "NielsenId3": "NONE",
                                    "TimedMetadata": "NONE",
                                    "VideoPid": 481,
                                    "AudioPids": [
                                        482,
                                        483,
                                        484,
                                        485,
                                        486,
                                        487,
                                        488,
                                        489,
                                        490,
                                        491,
                                        492
                                    ]
                                }
                            },
                            "VideoDescription": {
                                "Height": 720,
                                "ScalingBehavior": "DEFAULT",
                                "TimecodeInsertion": "DISABLED",
                                "AntiAlias": "ENABLED",
                                "Sharpness": 50,
                                "CodecSettings": {
                                    "Codec": "H_264",
                                    "H264Settings": {
                                        "InterlaceMode": "PROGRESSIVE",
                                        "NumberReferenceFrames": 3,
                                        "Syntax": "DEFAULT",
                                        "Softness": 0,
                                        "FramerateDenominator": 1001,
                                        "GopClosedCadence": 1,
                                        "GopSize": 90,
                                        "Slices": 1,
                                        "GopBReference": "DISABLED",
                                        "SlowPal": "DISABLED",
                                        "SpatialAdaptiveQuantization": "ENABLED",
                                        "TemporalAdaptiveQuantization": "ENABLED",
                                        "FlickerAdaptiveQuantization": "DISABLED",
                                        "EntropyEncoding": "CABAC",
                                        "Bitrate": 2097152,
                                        "FramerateControl": "SPECIFIED",
                                        "RateControlMode": "CBR",
                                        "CodecProfile": "MAIN",
                                        "Telecine": "NONE",
                                        "FramerateNumerator": 24000,
                                        "MinIInterval": 0,
                                        "AdaptiveQuantization": "HIGH",
                                        "CodecLevel": "AUTO",
                                        "FieldEncoding": "PAFF",
                                        "SceneChangeDetect": "DISABLED",
                                        "QualityTuningLevel": "SINGLE_PASS",
                                        "FramerateConversionAlgorithm": "DUPLICATE_DROP",
                                        "UnregisteredSeiTimecode": "DISABLED",
                                        "GopSizeUnits": "FRAMES",
                                        "ParControl": "INITIALIZE_FROM_SOURCE",
                                        "NumberBFramesBetweenReferenceFrames": 2,
                                        "RepeatPps": "DISABLED"
                                        //"DynamicSubGop": "STATIC"
                                    }
                                },
                                "AfdSignaling": "NONE",
                                "DropFrameTimecode": "ENABLED",
                                "RespondToAfd": "NONE",
                                "ColorMetadata": "INSERT"
                            },
                            "AudioDescriptions": [{
                                "AudioTypeControl": "FOLLOW_INPUT",
                                "AudioSourceName": "Audio Selector 1",
                                "CodecSettings": {
                                    "Codec": "AAC",
                                    "AacSettings": {
                                        "AudioDescriptionBroadcasterMix": "NORMAL",
                                        "Bitrate": 96000,
                                        "RateControlMode": "CBR",
                                        "CodecProfile": "LC",
                                        "CodingMode": "CODING_MODE_2_0",
                                        "RawFormat": "NONE",
                                        "SampleRate": 48000,
                                        "Specification": "MPEG4"
                                    }
                                },
                                "LanguageCodeControl": "FOLLOW_INPUT"
                            }],
                            "OutputSettings": {
                                "HlsSettings": {
                                    "AudioGroupId": "program_audio",
                                    "IFrameOnlyManifest": "EXCLUDE"
                                }
                            },
                            "NameModifier": "/hls"
                        }],
                        "OutputGroupSettings": {
                            "Type": "HLS_GROUP_SETTINGS",
                            "HlsGroupSettings": {
                                "ManifestDurationFormat": "INTEGER",
                                "SegmentLength": 10,
                                "TimedMetadataId3Period": 10,
                                "CaptionLanguageSetting": "OMIT",
                                "Destination": "s3://" + bucket + "/src/videos/media/",
                                "TimedMetadataId3Frame": "PRIV",
                                "CodecSpecification": "RFC_4281",
                                "OutputSelection": "MANIFESTS_AND_SEGMENTS",
                                "ProgramDateTimePeriod": 600,
                                "MinSegmentLength": 0,
                                //"MinFinalSegmentLength": 0,
                                "DirectoryStructure": "SINGLE_DIRECTORY",
                                "ProgramDateTime": "EXCLUDE",
                                "SegmentControl": "SEGMENTED_FILES",
                                "ManifestCompression": "NONE",
                                "ClientCache": "ENABLED",
                                "StreamInfResolution": "INCLUDE"
                            }
                        }
                    },
                    {
                        "Name": "File Group",
                        "Outputs": [{
                            "ContainerSettings": {
                                "Container": "MP4",
                                "Mp4Settings": {
                                    "CslgAtom": "INCLUDE",
                                    "FreeSpaceBox": "EXCLUDE",
                                    "MoovPlacement": "PROGRESSIVE_DOWNLOAD"
                                }
                            },
                            "VideoDescription": {
                                "Height": 720,
                                "ScalingBehavior": "DEFAULT",
                                "TimecodeInsertion": "DISABLED",
                                "AntiAlias": "ENABLED",
                                "Sharpness": 50,
                                "CodecSettings": {
                                    "Codec": "H_264",
                                    "H264Settings": {
                                        "InterlaceMode": "PROGRESSIVE",
                                        "NumberReferenceFrames": 3,
                                        "Syntax": "DEFAULT",
                                        "Softness": 0,
                                        "FramerateDenominator": 1001,
                                        "GopClosedCadence": 1,
                                        "GopSize": 90,
                                        "Slices": 1,
                                        "GopBReference": "DISABLED",
                                        "SlowPal": "DISABLED",
                                        "SpatialAdaptiveQuantization": "ENABLED",
                                        "TemporalAdaptiveQuantization": "ENABLED",
                                        "FlickerAdaptiveQuantization": "DISABLED",
                                        "EntropyEncoding": "CABAC",
                                        "Bitrate": 2097152,
                                        "FramerateControl": "SPECIFIED",
                                        "RateControlMode": "CBR",
                                        "CodecProfile": "MAIN",
                                        "Telecine": "NONE",
                                        "FramerateNumerator": 24000,
                                        "MinIInterval": 0,
                                        "AdaptiveQuantization": "HIGH",
                                        "CodecLevel": "AUTO",
                                        "FieldEncoding": "PAFF",
                                        "SceneChangeDetect": "DISABLED",
                                        "QualityTuningLevel": "SINGLE_PASS",
                                        "FramerateConversionAlgorithm": "DUPLICATE_DROP",
                                        "UnregisteredSeiTimecode": "DISABLED",
                                        "GopSizeUnits": "FRAMES",
                                        "ParControl": "INITIALIZE_FROM_SOURCE",
                                        "NumberBFramesBetweenReferenceFrames": 2,
                                        "RepeatPps": "DISABLED"
                                        //"DynamicSubGop": "STATIC"
                                    }
                                },
                                "AfdSignaling": "NONE",
                                "DropFrameTimecode": "ENABLED",
                                "RespondToAfd": "NONE",
                                "ColorMetadata": "INSERT"
                            },
                            "AudioDescriptions": [{
                                "AudioTypeControl": "FOLLOW_INPUT",
                                "CodecSettings": {
                                    "Codec": "AAC",
                                    "AacSettings": {
                                        "AudioDescriptionBroadcasterMix": "NORMAL",
                                        "Bitrate": 96000,
                                        "RateControlMode": "CBR",
                                        "CodecProfile": "LC",
                                        "CodingMode": "CODING_MODE_2_0",
                                        "RawFormat": "NONE",
                                        "SampleRate": 48000,
                                        "Specification": "MPEG4"
                                    }
                                },
                                "LanguageCodeControl": "FOLLOW_INPUT"
                            }]
                        }],
                        "OutputGroupSettings": {
                            "Type": "FILE_GROUP_SETTINGS",
                            "FileGroupSettings": {
                                "Destination": "s3://" + bucket + "/src/videos/media/"
                            }
                        }
                    }
                    ],
                    "AdAvailOffset": 0,
                    "Inputs": [{
                        "FileInput": "s3://" + bucket + "/" + key
                    }]
                } //,
                //"StatusUpdateInterval": "SECONDS_60"
            } : {
                "Queue": process.env.QUEUE,
                "JobTemplate": "lostpetjp-h",
                "UserMetadata": {},
                "Role": process.env.ROLE,
                "Settings": {
                    "OutputGroups": [
                        {
                            "Name": "File Group",
                            "Outputs": [{
                                "ContainerSettings": {
                                    "Container": "RAW"
                                },
                                "VideoDescription": {
                                    "Width": 720,
                                    "ScalingBehavior": "DEFAULT",
                                    "TimecodeInsertion": "DISABLED",
                                    "AntiAlias": "ENABLED",
                                    "Sharpness": 50,
                                    "CodecSettings": {
                                        "Codec": "FRAME_CAPTURE",
                                        "FrameCaptureSettings": {
                                            "FramerateNumerator": 1,
                                            "FramerateDenominator": 5,
                                            "MaxCaptures": 1,
                                            "Quality": 80
                                        }
                                    },
                                    "DropFrameTimecode": "ENABLED",
                                    "ColorMetadata": "INSERT"
                                }
                            }],
                            "OutputGroupSettings": {
                                "Type": "FILE_GROUP_SETTINGS",
                                "FileGroupSettings": {
                                    "Destination": "s3://" + bucket + "/media-convert/"
                                }
                            }
                        },
                        {
                            "Name": "Apple HLS",
                            "Outputs": [{
                                "ContainerSettings": {
                                    "Container": "M3U8",
                                    "M3u8Settings": {
                                        "AudioFramesPerPes": 4,
                                        "PcrControl": "PCR_EVERY_PES_PACKET",
                                        "PmtPid": 480,
                                        "PrivateMetadataPid": 503,
                                        "ProgramNumber": 1,
                                        "PatInterval": 0,
                                        "PmtInterval": 0,
                                        "Scte35Source": "NONE",
                                        "NielsenId3": "NONE",
                                        "TimedMetadata": "NONE",
                                        "VideoPid": 481,
                                        "AudioPids": [
                                            482,
                                            483,
                                            484,
                                            485,
                                            486,
                                            487,
                                            488,
                                            489,
                                            490,
                                            491,
                                            492
                                        ]
                                    }
                                },
                                "VideoDescription": {
                                    "Width": 720,
                                    "ScalingBehavior": "DEFAULT",
                                    "TimecodeInsertion": "DISABLED",
                                    "AntiAlias": "ENABLED",
                                    "Sharpness": 50,
                                    "CodecSettings": {
                                        "Codec": "H_264",
                                        "H264Settings": {
                                            "InterlaceMode": "PROGRESSIVE",
                                            "NumberReferenceFrames": 3,
                                            "Syntax": "DEFAULT",
                                            "Softness": 0,
                                            "FramerateDenominator": 1001,
                                            "GopClosedCadence": 1,
                                            "GopSize": 90,
                                            "Slices": 1,
                                            "GopBReference": "DISABLED",
                                            "SlowPal": "DISABLED",
                                            "SpatialAdaptiveQuantization": "ENABLED",
                                            "TemporalAdaptiveQuantization": "ENABLED",
                                            "FlickerAdaptiveQuantization": "DISABLED",
                                            "EntropyEncoding": "CABAC",
                                            "Bitrate": 2097152,
                                            "FramerateControl": "SPECIFIED",
                                            "RateControlMode": "CBR",
                                            "CodecProfile": "MAIN",
                                            "Telecine": "NONE",
                                            "FramerateNumerator": 24000,
                                            "MinIInterval": 0,
                                            "AdaptiveQuantization": "HIGH",
                                            "CodecLevel": "AUTO",
                                            "FieldEncoding": "PAFF",
                                            "SceneChangeDetect": "DISABLED",
                                            "QualityTuningLevel": "SINGLE_PASS",
                                            "FramerateConversionAlgorithm": "DUPLICATE_DROP",
                                            "UnregisteredSeiTimecode": "DISABLED",
                                            "GopSizeUnits": "FRAMES",
                                            "ParControl": "INITIALIZE_FROM_SOURCE",
                                            "NumberBFramesBetweenReferenceFrames": 2,
                                            "RepeatPps": "DISABLED"
                                            //"DynamicSubGop": "STATIC"
                                        }
                                    },
                                    "AfdSignaling": "NONE",
                                    "DropFrameTimecode": "ENABLED",
                                    "RespondToAfd": "NONE",
                                    "ColorMetadata": "INSERT"
                                },
                                "AudioDescriptions": [{
                                    "AudioTypeControl": "FOLLOW_INPUT",
                                    "AudioSourceName": "Audio Selector 1",
                                    "CodecSettings": {
                                        "Codec": "AAC",
                                        "AacSettings": {
                                            "AudioDescriptionBroadcasterMix": "NORMAL",
                                            "Bitrate": 96000,
                                            "RateControlMode": "CBR",
                                            "CodecProfile": "LC",
                                            "CodingMode": "CODING_MODE_2_0",
                                            "RawFormat": "NONE",
                                            "SampleRate": 48000,
                                            "Specification": "MPEG4"
                                        }
                                    },
                                    "LanguageCodeControl": "FOLLOW_INPUT"
                                }],
                                "OutputSettings": {
                                    "HlsSettings": {
                                        "AudioGroupId": "program_audio",
                                        "IFrameOnlyManifest": "EXCLUDE"
                                    }
                                },
                                "NameModifier": "/hls"
                            }],
                            "OutputGroupSettings": {
                                "Type": "HLS_GROUP_SETTINGS",
                                "HlsGroupSettings": {
                                    "ManifestDurationFormat": "INTEGER",
                                    "SegmentLength": 10,
                                    "TimedMetadataId3Period": 10,
                                    "CaptionLanguageSetting": "OMIT",
                                    "Destination": "s3://" + bucket + "/src/videos/media/", // 設置先
                                    "TimedMetadataId3Frame": "PRIV",
                                    "CodecSpecification": "RFC_4281",
                                    "OutputSelection": "MANIFESTS_AND_SEGMENTS",
                                    "ProgramDateTimePeriod": 600,
                                    "MinSegmentLength": 0,
                                    "DirectoryStructure": "SINGLE_DIRECTORY",
                                    "ProgramDateTime": "EXCLUDE",
                                    "SegmentControl": "SEGMENTED_FILES",
                                    "ManifestCompression": "NONE",
                                    "ClientCache": "ENABLED",
                                    "StreamInfResolution": "INCLUDE"
                                }
                            }
                        },
                        {
                            "Name": "File Group",
                            "Outputs": [{
                                "ContainerSettings": {
                                    "Container": "MP4",
                                    "Mp4Settings": {
                                        "CslgAtom": "INCLUDE",
                                        "FreeSpaceBox": "EXCLUDE",
                                        "MoovPlacement": "PROGRESSIVE_DOWNLOAD"
                                    }
                                },
                                "VideoDescription": {
                                    "Width": 720,
                                    "ScalingBehavior": "DEFAULT",
                                    "TimecodeInsertion": "DISABLED",
                                    "AntiAlias": "ENABLED",
                                    "Sharpness": 50,
                                    "CodecSettings": {
                                        "Codec": "H_264",
                                        "H264Settings": {
                                            "InterlaceMode": "PROGRESSIVE",
                                            "NumberReferenceFrames": 3,
                                            "Syntax": "DEFAULT",
                                            "Softness": 0,
                                            "FramerateDenominator": 1001,
                                            "GopClosedCadence": 1,
                                            "GopSize": 90,
                                            "Slices": 1,
                                            "GopBReference": "DISABLED",
                                            "SlowPal": "DISABLED",
                                            "SpatialAdaptiveQuantization": "ENABLED",
                                            "TemporalAdaptiveQuantization": "ENABLED",
                                            "FlickerAdaptiveQuantization": "DISABLED",
                                            "EntropyEncoding": "CABAC",
                                            "Bitrate": 2097152,
                                            "FramerateControl": "SPECIFIED",
                                            "RateControlMode": "CBR",
                                            "CodecProfile": "MAIN",
                                            "Telecine": "NONE",
                                            "FramerateNumerator": 24000,
                                            "MinIInterval": 0,
                                            "AdaptiveQuantization": "HIGH",
                                            "CodecLevel": "AUTO",
                                            "FieldEncoding": "PAFF",
                                            "SceneChangeDetect": "DISABLED",
                                            "QualityTuningLevel": "SINGLE_PASS",
                                            "FramerateConversionAlgorithm": "DUPLICATE_DROP",
                                            "UnregisteredSeiTimecode": "DISABLED",
                                            "GopSizeUnits": "FRAMES",
                                            "ParControl": "INITIALIZE_FROM_SOURCE",
                                            "NumberBFramesBetweenReferenceFrames": 2,
                                            "RepeatPps": "DISABLED"
                                            //"DynamicSubGop": "STATIC"
                                        }
                                    },
                                    "AfdSignaling": "NONE",
                                    "DropFrameTimecode": "ENABLED",
                                    "RespondToAfd": "NONE",
                                    "ColorMetadata": "INSERT"
                                },
                                "AudioDescriptions": [{
                                    "AudioTypeControl": "FOLLOW_INPUT",
                                    "CodecSettings": {
                                        "Codec": "AAC",
                                        "AacSettings": {
                                            "AudioDescriptionBroadcasterMix": "NORMAL",
                                            "Bitrate": 96000,
                                            "RateControlMode": "CBR",
                                            "CodecProfile": "LC",
                                            "CodingMode": "CODING_MODE_2_0",
                                            "RawFormat": "NONE",
                                            "SampleRate": 48000,
                                            "Specification": "MPEG4"
                                        }
                                    },
                                    "LanguageCodeControl": "FOLLOW_INPUT"
                                }]
                            }],
                            "OutputGroupSettings": {
                                "Type": "FILE_GROUP_SETTINGS",
                                "FileGroupSettings": {
                                    "Destination": "s3://" + bucket + "/src/videos/media/" // 設置先
                                }
                            }
                        }
                    ],
                    "AdAvailOffset": 0,
                    "Inputs": [{
                        "FileInput": "s3://" + bucket + "/" + key
                    }]
                }
            })))
            .then((data) => console.log("ok: ", data))
            .catch((err) => console.error("error: ", err))
            .finally(process.exit);
    }
}

export const handler = (s3Event: S3Event) => {
    const event = s3Event.Records[0].s3;
    new Process(event.bucket.name, event.object.key);
}