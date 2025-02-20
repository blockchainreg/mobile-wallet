package com.velas.mobile_wallet.generated;

import java.util.Arrays;
import java.util.List;
import org.unimodules.core.interfaces.Package;

public class BasePackageList {
  public List<Package> getPackageList() {
    return Arrays.<Package>asList(
        new expo.modules.application.ApplicationPackage(),
        new expo.modules.barcodescanner.BarCodeScannerPackage(),
        new expo.modules.camera.CameraPackage(),
        new expo.modules.constants.ConstantsPackage(),
        new expo.modules.errorrecovery.ErrorRecoveryPackage(),
        new expo.modules.filesystem.FileSystemPackage(),
        new expo.modules.font.FontLoaderPackage(),
        new expo.modules.haptics.HapticsPackage(),
        new expo.modules.imageloader.ImageLoaderPackage(),
        new expo.modules.keepawake.KeepAwakePackage(),
        new expo.modules.lineargradient.LinearGradientPackage(),
        new expo.modules.localauthentication.LocalAuthenticationPackage(),
        new expo.modules.permissions.PermissionsPackage(),
        new expo.modules.securestore.SecureStorePackage(),
        new expo.modules.splashscreen.SplashScreenPackage(),
        new expo.modules.updates.UpdatesPackage()
    );
  }
}
