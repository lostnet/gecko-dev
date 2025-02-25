/*
 *  Copyright (c) 2012 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree. An additional intellectual property rights grant can be found
 *  in the file PATENTS.  All contributing project authors may
 *  be found in the AUTHORS file in the root of the source tree.
 */

#ifndef MODULES_VIDEO_CAPTURE_MAIN_SOURCE_LINUX_DEVICE_INFO_LINUX_H_
#define MODULES_VIDEO_CAPTURE_MAIN_SOURCE_LINUX_DEVICE_INFO_LINUX_H_

#include <stdint.h>

#include "modules/video_capture/device_info_impl.h"

#include "rtc_base/platform_thread.h"
#include <sys/inotify.h>

struct v4l2_capability;

namespace webrtc {
namespace videocapturemodule {
class DeviceInfoLinux : public DeviceInfoImpl {
 public:
  DeviceInfoLinux();
  ~DeviceInfoLinux() override;
  uint32_t NumberOfDevices() override;
  int32_t GetDeviceName(uint32_t deviceNumber,
                        char* deviceNameUTF8,
                        uint32_t deviceNameLength,
                        char* deviceUniqueIdUTF8,
                        uint32_t deviceUniqueIdUTF8Length,
                        char* productUniqueIdUTF8 = 0,
                        uint32_t productUniqueIdUTF8Length = 0,
                        pid_t* pid=0) override;
  /*
   * Fills the membervariable _captureCapabilities with capabilites for the
   * given device name.
   */
  int32_t CreateCapabilityMap(const char* deviceUniqueIdUTF8) override;
  int32_t DisplayCaptureSettingsDialogBox(const char* /*deviceUniqueIdUTF8*/,
                                          const char* /*dialogTitleUTF8*/,
                                          void* /*parentWindow*/,
                                          uint32_t /*positionX*/,
                                          uint32_t /*positionY*/) override;
  int32_t FillCapabilities(int fd);
  int32_t Init() override;

 private:
  bool IsDeviceNameMatches(const char* name, const char* deviceUniqueIdUTF8);
  bool IsVideoCaptureDevice(struct v4l2_capability* cap);

#ifdef WEBRTC_LINUX
  void HandleEvent(inotify_event* event, int fd);
  int EventCheck(int fd);
  int HandleEvents(int fd);
  int ProcessInotifyEvents();
  std::unique_ptr<rtc::PlatformThread> _inotifyEventThread;
  static void InotifyEventThread(void*);
  void InotifyProcess();
  int _fd_v4l, _fd_dev, _wd_v4l, _wd_dev; /* accessed on InotifyEventThread thread */
  std::atomic<bool> _isShutdown;
#endif
};
}  // namespace videocapturemodule
}  // namespace webrtc
#endif  // MODULES_VIDEO_CAPTURE_MAIN_SOURCE_LINUX_DEVICE_INFO_LINUX_H_
