//
//  ViewController.swift
//  Brand Central
//
//  Created by Evan Bradley on 12/6/17.
//  Copyright © 2017 Evan Bradley. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var appWebView: UIWebView!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        let url = URL(string: "https://brandcentral.xyz/")
        appWebView.loadRequest(URLRequest(url: url!))
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

